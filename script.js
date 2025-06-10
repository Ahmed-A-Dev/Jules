document.addEventListener('DOMContentLoaded', () => {
    const commandInput = document.getElementById('command');
    const outputDiv = document.getElementById('output');
    const terminal = document.getElementById('terminal');
    const promptElement = document.getElementById('prompt');

    let commandHistory = [];
    let historyIndex = -1;
    let currentInputBuffer = "";

    const portfolioData = {
        email: "your.email@example.com",
        githubUsername: "yourusername",
        linkedinProfile: "yourlinkedinprofile",
        about: "This is a terminal portfolio website. I'm a passionate developer interested in web technologies and creative coding.",
        projects: [
            { name: "Project Alpha", description: "A cool thing I built using cutting-edge imaginary technology." },
            { name: "Project Beta", description: "An interesting endeavor into the realm of digital whatnots." },
            { name: "Work In Progress", description: "Stay tuned for more!" }
        ],
        skills: ["HTML", "CSS", "JavaScript", "Node.js (conceptual)", "Python (for scripting)", "Problem Solving", "Debugging", "ASCII Artistry"]
    };

    const availableThemes = [
        "dark", "light", "dracula", "onedark", "tokyo",
        "monokai", "nord", "cyberpunk", "hacker", "retro", "ocean"
    ];

    const fortunes = [
        "A beautiful adventure awaits you.",
        "You will find a forgotten treasure.",
        "Good news will come to you by mail (or email).",
        "Your creativity will shine today.",
        "An exciting opportunity lies ahead."
    ];

    const jokes = [
        { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
        { setup: "Why did the scarecrow win an award?", punchline: "Because he was outstanding in his field!" }
    ];

    const asciiArt = {
        'heart': [
            "  ***   ***",
            " ******* *****",
            " *************",
            "  ***********",
            "   *********",
            "    *******",
            "     *****",
            "      ***",
            "       *"
        ],
        'smiley': [
            "   .--''''''--.",
            " .'           `.",
            "/   O      O    \\",
            "|    \\  ^^  /    |",
            " \\     `----'     /",
            "  `. ________ .' ",
            "    `--------`"
        ],
        'star': ["      *", "     *** ", "    *****", "   *******", "  *********", "   *******", "    *****", "     *** ", "      *"],
        'coffee': ["    ( (", "     ) )", "  .........", "  |       |___", "  |       |_  |", "  |       |_| |", "  |_______|   /", "   \\_______/"]
    };

    const commands = {
        'help': {
            description: "List all available commands or show help for a specific command.",
            usage: "help [command]",
            execute: (args) => {
                if (args.length > 0) {
                    const cmdName = args[0].toLowerCase();
                    if (commands[cmdName] && commands[cmdName].description) {
                        appendOutput(`${cmdName}: ${commands[cmdName].description}`);
                        if (commands[cmdName].usage) {
                            appendOutput(`Usage: ${commands[cmdName].usage}`);
                        }
                    } else {
                        appendOutput(`No help available for '${escapeHtml(cmdName)}'.`);
                    }
                } else {
                    appendOutput("Available commands:");
                    for (const cmd in commands) {
                        let line = `- ${cmd}: ${commands[cmd].description}`;
                        if (commands[cmd].usage) {
                            line += ` (Usage: ${commands[cmd].usage})`;
                        }
                        appendOutput(line);
                    }
                }
            }
        },
        'about': {
            description: "Display information about the website owner.",
            execute: () => appendOutput(portfolioData.about)
        },
        'projects': {
            description: "List portfolio projects.",
            execute: () => {
                appendOutput("Projects:");
                portfolioData.projects.forEach(p => appendOutput(`- ${escapeHtml(p.name)}: ${escapeHtml(p.description)}`));
            }
        },
        'skills': {
            description: "Show technical skills.",
            execute: () => {
                appendOutput("Skills:");
                portfolioData.skills.forEach(s => appendOutput(`- ${escapeHtml(s)}`));
            }
        },
        'contact': {
            description: "Show email and social media links.",
            execute: () => {
                appendOutput("Contact Information:");
                appendOutput(`- Email: ${escapeHtml(portfolioData.email)} (use 'email' command to copy)`);
                appendOutput(`- GitHub: ${escapeHtml(portfolioData.githubUsername)} (use 'github' command to open)`);
                appendOutput(`- LinkedIn: ${escapeHtml(portfolioData.linkedinProfile)} (use 'linkedin' command to open)`);
            }
        },
        'github': {
            description: "Open the GitHub profile in a new browser tab.",
            execute: () => {
                window.open(`https://github.com/${portfolioData.githubUsername}`, '_blank');
                appendOutput(`Opening GitHub profile for ${escapeHtml(portfolioData.githubUsername)}...`);
            }
        },
        'linkedin': {
            description: "Open the LinkedIn profile in a new browser tab.",
            execute: () => {
                window.open(`https://linkedin.com/in/${portfolioData.linkedinProfile}`, '_blank');
                appendOutput(`Opening LinkedIn profile for ${escapeHtml(portfolioData.linkedinProfile)}...`);
            }
        },
        'email': {
            description: "Copy the email address to clipboard.",
            execute: () => {
                navigator.clipboard.writeText(portfolioData.email).then(() => {
                    appendOutput(`Email address '${escapeHtml(portfolioData.email)}' copied to clipboard.`);
                }).catch(err => {
                    appendOutput(`Error copying email: ${err}. You might need to enable clipboard permissions or copy manually.`);
                    appendOutput(`Email: ${escapeHtml(portfolioData.email)}`);
                });
            }
        },
        'clear': {
            description: "Clear all terminal output.",
            execute: () => {
                outputDiv.innerHTML = '';
            }
        },
        'welcome': { // The 'welcome' command can still exist for users to call manually
            description: "Display the welcome message.",
            execute: displayWelcomeMessage // Points to the main welcome function
        },
        'theme': {
            description: "Change the terminal color theme or list available themes.",
            usage: "theme <theme_name> | theme list",
            execute: (args) => {
                if (args.length === 0 || (args.length === 1 && args[0].toLowerCase() === 'list')) {
                    appendOutput("Available themes: " + availableThemes.join(", "));
                    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                    appendOutput(`Current theme: ${currentTheme}`);
                    return;
                }
                const themeName = args[0].toLowerCase();
                if (availableThemes.includes(themeName)) {
                    document.documentElement.setAttribute('data-theme', themeName);
                    appendOutput(`Theme changed to '${escapeHtml(themeName)}'.`);
                } else {
                    appendOutput(`Error: Theme '${escapeHtml(themeName)}' not found.`);
                    appendOutput("Available themes: " + availableThemes.join(", "));
                }
            }
        },
        'cowsay': {
            description: "Display an ASCII cow with the provided message.",
            usage: "cowsay <message>",
            execute: (args) => {
                const message = args.join(" ").trim();
                if (!message) {
                    appendOutput("What should the cow say? Moo-ve along if you have nothing for it!");
                    appendOutput("Usage: cowsay <message>");
                    return;
                }
                const escapedMessage = escapeHtml(message);
                const topBubble = "  " + "_".repeat(escapedMessage.length + 2);
                const midBubble = "< " + escapedMessage + " >";
                const bottomBubble = "  " + "-".repeat(escapedMessage.length + 2);
                const cowArt = [
                    topBubble, midBubble, bottomBubble,
                    "        \\   ^__^",
                    "         \\  (oo)\\_______",
                    "            (__)\\       )\\/\\",
                    "                ||----w |",
                    "                ||     ||"
                ];
                cowArt.forEach(line => appendOutput(line));
            }
        },
        'date': {
            description: "Display the current date and time.",
            execute: () => appendOutput(new Date().toLocaleString())
        },
        'echo': {
            description: "Print back the provided arguments.",
            usage: "echo [text ...]",
            execute: (args) => appendOutput(args.join(" "))
        },
        'fortune': {
            description: "Display a random fortune cookie message.",
            execute: () => {
                const randomIndex = Math.floor(Math.random() * fortunes.length);
                appendOutput(fortunes[randomIndex]);
            }
        },
        'joke': {
            description: "Tell a random joke.",
            execute: () => {
                const randomIndex = Math.floor(Math.random() * jokes.length);
                const randomJoke = jokes[randomIndex];
                appendOutput(randomJoke.setup);
                setTimeout(() => appendOutput(randomJoke.punchline), 1000);
            }
        },
        'art': {
            description: "Display predefined ASCII art.",
            usage: "art <art_name> | art list",
            execute: (args) => {
                if (args.length === 0 || args[0].toLowerCase() === 'list') {
                    appendOutput("Available art: " + Object.keys(asciiArt).join(", "));
                    return;
                }
                const artName = args[0].toLowerCase();
                if (asciiArt[artName]) {
                    asciiArt[artName].forEach(line => appendOutput(line));
                } else {
                    appendOutput(`Art '${escapeHtml(artName)}' not found. Available art: ${Object.keys(asciiArt).join(", ")}`);
                }
            }
        },
        'calc': {
            description: "Evaluate a simple arithmetic expression.",
            usage: "calc <expression>",
            execute: (args) => {
                const expression = args.join(" ").trim();
                if (!expression) {
                    appendOutput("Usage: calc <expression>");
                    appendOutput("Example: calc 2 + 3 * (4 / 2)");
                    return;
                }
                try {
                    const result = new Function('return ' + expression)();
                    if (typeof result === 'number' && !isNaN(result)) {
                        appendOutput(result.toString());
                    } else {
                        appendOutput(escapeHtml(String(result)));
                    }
                } catch (error) {
                    appendOutput(`Error: ${escapeHtml(error.message)}`);
                }
            }
        }
    };

    terminal.addEventListener('click', () => {
        commandInput.focus();
    });

    commandInput.addEventListener('keydown', function(event) {
        const key = event.key;
        if (key === 'Enter') {
            event.preventDefault();
            const fullCommandText = commandInput.value.trim();
            if (fullCommandText !== '') {
                const commandOutputLine = document.createElement('div');
                commandOutputLine.innerHTML = `<span class="prompt">${escapeHtml(promptElement.textContent)}</span> ${escapeHtml(fullCommandText)}`;
                outputDiv.appendChild(commandOutputLine);
                processCommand(fullCommandText);
                if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== fullCommandText) {
                    commandHistory.push(fullCommandText);
                }
                historyIndex = commandHistory.length;
                currentInputBuffer = "";
                commandInput.value = '';
            }
            scrollToBottom();
            commandInput.focus();
        } else if (key === 'ArrowUp') {
            event.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex === commandHistory.length) {
                    currentInputBuffer = commandInput.value;
                }
                if (historyIndex > 0) {
                    historyIndex--;
                    commandInput.value = commandHistory[historyIndex];
                    commandInput.setSelectionRange(commandInput.value.length, commandInput.value.length);
                }
            }
        } else if (key === 'ArrowDown') {
            event.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    commandInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    commandInput.value = currentInputBuffer;
                }
                commandInput.setSelectionRange(commandInput.value.length, commandInput.value.length);
            }
        }
    });

    function processCommand(fullCommandText) {
        const parts = fullCommandText.split(/\s+/);
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);
        if (commands[commandName]) {
            try {
                commands[commandName].execute(args);
            } catch (error) {
                appendOutput(`Error executing command '${escapeHtml(commandName)}': ${error.message}`);
                console.error(`Command ${commandName} error:`, error);
            }
        } else {
            appendOutput(`Command '${escapeHtml(commandName)}' not found. Type 'help' to see all available commands.`);
        }
    }

    function appendOutput(content, isHtml = false) {
        const line = document.createElement('div');
        if (isHtml) {
            line.innerHTML = content;
        } else {
            line.textContent = content;
        }
        outputDiv.appendChild(line);
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function scrollToBottom() {
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    const welcomeArt = [
        " __      __   _                    _         _ ",
        " \\ \\    / /  | |                  | |       | | ",
        "  \\ \\  / /__ | | ___  _ __   ___  | |  __ _ | |_  ___   _ __ ___ ",
        "   \\ \\/ / _ \\| |/ _ \\| '_ \\ / _ \\ | | / _` || __|/ _ \\ | '_ ` _ \\ ",
        "    \\  /|  __/| | (_) | | | | (_) || || (_| || |_| (_) || | | | | |",
        "     \\/  \\___||_|\___/|_| |_|\\___/ |_| \\__,_| \\__|\___/ |_| |_| |_|",
        "",
    ];

    const welcomeTextMessages = [ // Renamed to avoid conflict with 'welcomeMessages' in prompt
        "Welcome to your Personal Terminal Portfolio!",
        "Type 'help' to see available commands.",
        "----------------------------------------------------------------"
    ];

    function displayWelcomeMessage() { // This is the main welcome message function
        welcomeArt.forEach(line => appendOutput(line));
        welcomeTextMessages.forEach(line => appendOutput(line));
        scrollToBottom();
    }

    // Call the primary welcome message display function on load
    displayWelcomeMessage();

    // Initial focus on command input
    commandInput.focus();

    // Note: The 'welcome' command in the commands object now also calls displayWelcomeMessage.
    // Any previous `commands.welcome.execute()` call on load for a *different*, simpler message
    // has been effectively replaced by calling displayWelcomeMessage() directly.
});
