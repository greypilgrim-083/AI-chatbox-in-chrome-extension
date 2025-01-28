# AI Extension

This is an AI-powered browser extension designed to assist users with coding-related tasks. It provides features like code analysis, error detection, code enhancement, and quick suggestions for common coding queries. The extension integrates with platforms like LeetCode, CodeForces, Jupyter Notebooks, and Google Colab to extract and analyze code content.

---

## Features

1. **Code Extraction**:
   - Extracts code and problem descriptions from platforms like LeetCode, CodeForces, Jupyter Notebooks, and Google Colab.

2. **AI-Powered Assistance**:
   - Provides AI-generated responses to user queries, such as code explanations, error detection, and optimization suggestions.

3. **Quick Suggestions**:
   - Displays suggested questions like "Solve this code", "Explain this code", and "Do it in another way" for quick interaction.

4. **Interactive Chatbox**:
   - A chatbox interface where users can type their queries and receive AI-generated responses.
   - Supports drag-to-move, resizing, and minimizing the chatbox.

5. **Input Validation**:
   - Prevents empty queries from being sent.

6. **Modern Design**:
   - A sleek and user-friendly design with gradients, shadows, and animations.

---

## Files and Structure

The project consists of the following files:

1. **`index.html`**:
   - The main HTML file for the extension's popup interface.

2. **`design.css`**:
   - Contains the styles for the extension's UI, including the chatbox and popup.

3. **`manifest.json`**:
   - The manifest file defining the extension's metadata, permissions, and content scripts.

4. **`content.js`**:
   - The main script for extracting code and content from supported platforms and creating the chatbox.

5. **`background.js`**:
   - Handles background tasks like API requests and message passing between the extension and the browser.

6. **`AI_API.js`**:
   - Contains the logic for interacting with the AI API (e.g., OpenAI or Gemini).

7. **`popup.html`**:
   - The HTML file for the extension's popup interface.

8. **`popup.js`**:
   - Handles user interactions in the popup, such as saving the API key.

9. **`script.js`**:
   - A placeholder script for additional functionality (e.g., fetching data from external APIs).

---

## Setup Instructions

### 1. Prerequisites
- A modern browser like Google Chrome or Microsoft Edge.
- An API key for the AI service (e.g., OpenAI or Gemini).

### 2. Installation
1. Clone or download the repository to your local machine.
2. Open your browser and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the folder containing the extension files.

### 3. Configuration
1. Open the extension popup by clicking its icon in the browser toolbar.
2. Enter your AI API key in the provided input field and click **Save Key**.
3. The extension is now ready to use.

---

## Usage

1. **Open the Chatbox**:
   - The chatbox will automatically appear on supported platforms (e.g., LeetCode, CodeForces, Jupyter Notebooks).

2. **Ask Questions**:
   - Type your query in the input box or click one of the suggested questions (e.g., "Enhance this code").
   - Press **Enter** or click **Send** to submit your query.

3. **View Responses**:
   - The AI's response will appear in the chatbox.

4. **Resize and Move**:
   - Drag the chatbox to move it around the screen.
   - Use the resize handles in the corners to adjust the size.

5. **Minimize**:
   - Click the **−** button to minimize the chatbox. Click it again to restore.

---

## Supported Platforms

- **LeetCode**: Extracts problem titles, descriptions, and code.
- **CodeForces**: Extracts problem statements, input/output specifications, and sample tests.
- **Jupyter Notebooks**: Extracts code cells and markdown content.
- **Google Colab**: Extracts code cells and markdown content.

---

## Dependencies

- **AI API**: The extension requires an API key for an AI service (e.g., OpenAI or Gemini).
- **Browser Permissions**: The extension requires permissions to access specific websites and interact with their content.

---

## Future Enhancements

1. **Support for More Platforms**:
   - Add support for additional coding platforms like HackerRank, Kaggle, and GitHub.

2. **Customizable Suggestions**:
   - Allow users to customize or add their own suggested questions.

3. **Multi-Language Support**:
   - Add support for multiple programming languages.

4. **Dark Mode**:
   - Add a dark mode option for better usability in low-light environments.

5. **Export Chat History**:
   - Allow users to export their chat history for future reference.
  
6.  **Clear Chat**:
   - Allows users to clear the chat history with a single click

7. **Typing Indicator**:
   - Shows that AI is typing

---

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request with a detailed description of your changes.
