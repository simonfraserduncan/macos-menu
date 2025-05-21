# Langflow Tray (macOS)

A minimal macOS menu bar application for providing quick access to Langflow and related developer resources.

## Features

*   Tray icon for Langflow.
*   Menu with options to:
    *   Open the Langflow application (if installed at `/Applications/Langflow.app`).
    *   Access Langflow documentation.
    *   Send feedback (via GitHub issues).
    *   Join the Langflow Discord.
    *   Follow the Langflow repository on GitHub.
    *   Follow Langflow on X (formerly Twitter).
    *   (Placeholder) Settings.
    *   (Placeholder) Check for updates.
    *   Quit the application.

## Development

This application is built with Electron.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm)

### Getting Started

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone https://github.com/simonfraserduncan/macos-menu.git
    cd macos-menu/langflow-tray
    ```
    (Adjust path if you cloned into `langflow-tray` directly)

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application in development mode:**
    ```bash
    npm start
    ```

## Project Structure

*   `src/index.js`: Main Electron process.
*   `src/assets/`: Contains application icons.
*   `package.json`: Project metadata and dependencies.
*   `requirements.md`: Original project requirements.
*   `plan.md`: Execution plan followed for development.

---

Built as a pair-programming exercise. 