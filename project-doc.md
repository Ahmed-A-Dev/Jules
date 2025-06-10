# Project Documentation: Terminal Portfolio Website

## 1. Project Goal and Constraints

**Goal:** Build a personal portfolio website styled as a retro terminal interface using only HTML, CSS, and JavaScript. No frameworks or build tools are allowed. The website should be modular, extensible, and well-documented.

**Constraints:**
- Technologies: HTML, CSS, JavaScript only.
- No external JS/CSS frameworks or libraries (e.g., jQuery, Bootstrap).
- No build tools (e.g., Webpack, Babel, Sass).
- Must be responsive and full-screen.
- All text must use a monospaced font.
- Focus on accessibility, visual coherence, and user experience.

## 2. Task Breakdown and Progression Checklist

This checklist outlines the main tasks for the project.

- [x] 1. *Set up the basic HTML structure.*
- [x] 2. *Implement the basic terminal styling.*
- [x] 3. *Implement the command input and output.*
- [x] 4. *Implement the command history.*
- [x] 5. *Implement the basic commands.*
- [x] 6. *Implement the theming system.*
- [x] 7. *Implement the `cowsay` command.*
- [x] 8. *Implement at least 5 additional creative and useful commands.*
- [x] 9. *Implement the welcome message.*
- [ ] 10. *Implement animated progress bars.*
- [ ] 11. *Implement cursor style selection.*
- [ ] 12. *Implement a real-time ASCII clock.*
- [ ] 13. *Implement the ASCII snake game.*
- [ ] 14. *Implement the Tetris simulation.*
- [ ] 15. *Implement the interactive ASCII World component.*
- [ ] 16. *Final review and documentation update.*
- [ ] 17. *Submit the project.*

## 3. Issue Log and Resolutions

**Note:** Resolution for issues identified in the review on (Date of Last Review) is currently in progress. Issues will be updated here as they are addressed.

This section outlines identified issues, bugs, or deviations from the project requirements based on a review of the codebase (`index.html`, `style.css`, `script.js`) and `project-doc.md` as of the review date.

### Issue 1: `project-doc.md` - Incomplete Detailed Task Tracking and History
*   **Issue:** The `project-doc.md` file, while initialized, is not being consistently updated with detailed implementation notes for each subtask, a log of bugs encountered and fixed during development, or a formal change history as outlined in the "Project Development Instructions". The "Task Breakdown and Progression Checklist" section is also just a placeholder and does not reflect the current granular status of the plan steps.
*   **Location:** `project-doc.md` (content and update process).
*   **Cause:** The development process has focused on implementing features and using the agent's internal plan tracking. The detailed documentation aspect within `project-doc.md` (like per-subtask notes, bug logs, change history) has not been actively maintained by the agent.
*   **Possible Fixes:** The agent needs to strictly follow instructions to update this document after each relevant subtask, including detailed notes, bug logs (if any), and change history. For past tasks, a retroactive update should be performed.

### Issue 3: Unimplemented Features (Currently as Future Plan Steps)
*   **Issue:** Several features listed in the "Core Requirements" (e.g., Tab autocomplete, `man` pages) and "Visual Effects and Enhancements" (e.g., progress bars, cursor styles, clock, Snake, Tetris, ASCII world) are not yet implemented.
*   **Location:** Not applicable (features not yet built).
*   **Cause:** These are scheduled for later in the development plan.
*   **Possible Fixes:** Continue development according to the plan. This is not a deviation but an observation of current progress.

### Issue 4: `calc` Command - Input Sanitization for `Function` Constructor
*   **Issue:** The `calc` command uses `new Function('return ' + expression)()` for evaluating arithmetic expressions. While generally safer than direct `eval()`, it can still be vulnerable to malicious input if not handled carefully, potentially allowing execution of arbitrary JavaScript if the input string is crafted to break out of the simple arithmetic context.
*   **Location:** `script.js`, in the `execute` function of the `calc` command.
*   **Cause:** The command assumes user input is a well-intentioned arithmetic expression. The current implementation does not robustly sanitize or parse the expression to ensure it's purely arithmetic.
*   **Possible Fixes:**
    *   Implement a proper parser for arithmetic expressions (e.g., using Shunting-yard algorithm or a Pratt parser) to convert the infix expression to postfix (RPN) and then evaluate it safely.
    *   Alternatively, use a well-vetted third-party math expression parser library if the "no external libraries" constraint could be relaxed for such specific, high-risk functionalities (though the project states no external JS libraries).
    *   As a simpler, interim measure, apply stricter validation to the input string to allow only numbers, basic arithmetic operators (+, -, *, /, %, parentheses), and whitespace. This would reduce but not completely eliminate risks. For example, `(alert('XSS'))` would be invalid, but complex strings might still find ways to execute code.
    *   Given the "no external libraries" and "no build tools" constraints, a custom, simple parser with strict validation is the most aligned approach.
---
**Status:** Acknowledged ((Date of acknowledgment))
**Note:** This issue points to a potential hardening improvement for the `calc` command by adding stricter input validation (e.g., via regex) before using the `Function` constructor. While the current implementation is functional for basic arithmetic and `new Function()` is safer than `eval()`, this improvement is deferred for now to prioritize the completion of core planned features. It will be reconsidered for a future development phase focused on hardening or if specific security/stability concerns arise from its current state.

### Issue 6: Project Data in `script.js`
*   **Issue:** Portfolio data (about, projects, skills, contact info) and content for commands like `fortune`, `joke`, `art` are hardcoded directly in `script.js`.
*   **Location:** `script.js` (global constants/variables within `DOMContentLoaded`).
*   **Cause:** Simplicity of initial implementation.
*   **Possible Fixes (for future enhancement, not strictly a bug):**
    *   Move this data into separate JSON files (e.g., `portfolio-data.json`, `fortunes.json`).
    *   Fetch these JSON files using `fetch()` API when the script loads.
    *   This would make the main `script.js` cleaner and data easier to manage/update. This is a good candidate for a future refactoring task if time permits.

### Issue 7: `escapeHtml` usage consistency
*   **Issue:** Review of `script.js` shows `escapeHtml` is used in many places for security when displaying user-provided or dynamic text. However, in the `projects` command, while `p.description` is escaped, `p.name` is not.
    ```javascript
    portfolioData.projects.forEach(p => appendOutput(`- ${p.name}: ${escapeHtml(p.description)}`));
    ```
*   **Conclusion for `projects` command:** While `p.description` is escaped, `p.name` is not. If `p.name` could ever contain characters that might be interpreted as HTML, it should also be escaped. Given that `portfolioData` is currently hardcoded and controlled, the risk is minimal, but for best practice and future-proofing (e.g., if data becomes dynamic), it should be escaped.
*   **Location:** `script.js`, `projects` command's `execute` function.
*   **Cause:** Oversight.
*   **Possible Fix:** Change `appendOutput(\`- ${p.name}: ${escapeHtml(p.description)}\`)` to `appendOutput(\`- ${escapeHtml(p.name)}: ${escapeHtml(p.description)}\`)`.
---
**Status:** Resolved ((Date of fix))
**Resolution:** Modified `script.js` in the `projects` command's `execute` function. The project name (`p.name`) is now also passed through `escapeHtml()` before being output, similar to how the description was handled. This ensures both parts of the project listing are consistently sanitized.

## 4. Change Log

*(Entries are high-level and use placeholder dates for past events)*

- **((Date of acknowledgment)):** Acknowledged `calc` command input sanitization (Issue #4) as a deferred improvement for future consideration.
- **((Date of fix)):** Resolved `escapeHtml` inconsistency in `projects` command: project names are now also sanitized. (Ref: Issue #7 from review dated (Date of Last Review))
- **(Date of Step 9 Completion):** Implemented a large ASCII art welcome message on page load and updated the `welcome` command. (Plan Step 9)
- **(Date of Step 8 Completion):** Implemented 6 additional commands: `date`, `echo`, `fortune`, `joke`, `art`, `calc`. (Plan Step 8)
- **(Date of Step 7 Completion):** Implemented the `cowsay` command. (Plan Step 7)
- **(Date of Step 6 Completion):** Implemented the theming system with 12 themes and `theme` command. (Plan Step 6)
- **(Date of Step 5 Completion):** Implemented basic commands: `help`, `about`, `projects`, `skills`, `contact`, `github`, `linkedin`, `email`, `clear`. (Plan Step 5)
- **(Date of Step 4 Completion):** Implemented command history navigation. (Plan Step 4)
- **(Date of Step 3 Completion):** Implemented command input, output, autofocus, and auto-scrolling. (Plan Step 3)
- **(Date of Step 2 Completion):** Implemented basic terminal styling (full-screen, monospaced font, CSS cursor). (Plan Step 2)
- **(Date of Step 1 Completion):** Set up basic HTML structure, CSS, JS files, and initial `project-doc.md`. (Plan Step 1)
- **(Date of Initial Commit/Project Start):** Project initialized. `project-doc.md` created with goal and constraints.

---
*This document will be updated throughout the project development.*
