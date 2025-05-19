# Product Hunt AI Comment Helper - User Guide

This Chrome extension helps you generate insightful comments for Product Hunt submissions using AI.

## 1. Installation

* **Download the Extension**:
    * If you received the files in a ZIP archive, extract them to a folder on your computer.
    * If you have the individual files, make sure they are all together in one folder (e.g., `my_producthunt_ai_helper`).
* **Open Chrome Extensions Page**:
    * Type `chrome://extensions` into your Chrome address bar and press Enter.
* **Enable Developer Mode**:
    * In the top-right corner of the Extensions page, find the "Developer mode" toggle and turn it **ON**.
    ![Developer Mode Toggle](https://i.imgur.com/IMAGE_ID_FOR_DEV_MODE_TOGGLE.png) * **Load the Extension**:
    * Click the "Load unpacked" button that appears (usually on the top-left).
    * In the file dialog that opens, navigate to and select the folder where you saved/extracted the extension files (e.g., `my_producthunt_ai_helper`). Click "Select Folder".
* **Extension Added**:
    * The "Product Hunt AI Comment Helper" should now appear in your list of extensions and its icon will be added to your Chrome toolbar.

## 2. Configuration (Important First Step!)

Before you can use the AI features, you need to set up your OpenAI API Key:

* **Open Options Page**:
    * Right-click on the "Product Hunt AI Comment Helper" icon in your Chrome toolbar.
    * Select "Options" from the menu.
    * (Alternatively, on the `chrome://extensions` page, find the extension, click "Details", then "Extension options".)
* **Enter API Key**:
    * In the "AI API Key" field, paste your OpenAI API Key.
    * ![Options Page API Key](https://i.imgur.com/IMAGE_ID_FOR_OPTIONS_PAGE.png) * **API Endpoint URL (Optional)**:
    * The "AI API Endpoint URL" field will default to OpenAI's standard chat completions endpoint (`https://api.openai.com/v1/chat/completions`).
    * You can leave this blank to use the default. Only change it if you are using a proxy or a different OpenAI-compatible API endpoint.
* **Save Settings**:
    * Click the "Save Settings" button. You should see a "Settings saved!" confirmation.

## 3. How to Use on Product Hunt

1.  **Navigate to a Product Page**:
    * Go to any product page on `https://www.producthunt.com`.
2.  **Find the Comment Section**:
    * Scroll down to where you would normally write a comment.
3.  **Locate the "AI Gen" Button**:
    * You will see a new "✨ **AI Gen**" button injected to the left of Product Hunt's native "Comment" button.
    ![AI Gen Button on Product Hunt](https://i.imgur.com/IMAGE_ID_AI_GEN_BUTTON.png) 4.  **Generate a Comment**:
    * Click the "✨ **AI Gen**" button.
    * The button text will change to "Generating..." while it works.
    * The extension automatically extracts context from the page (like the product name, tagline, and description) and sends it to the AI to generate a relevant comment.
5.  **Review and Use the Comment**:
    * Once the AI has finished, the generated comment will be automatically inserted into the Product Hunt comment editor.
    * The extension will also try to trigger events so that Product Hunt recognizes the input (e.g., enabling the main "Comment" button).
    * **Important**: Always review the AI-generated comment. Edit it for accuracy, tone, and to add your personal touch before submitting.
    * If, for any reason, the comment doesn't appear directly in the editor, an alert will pop up stating that the comment has been copied to your clipboard. You can then manually paste it (Ctrl+V or Cmd+V) into the comment box.
6.  **Submit Your Comment**:
    * After reviewing and editing, click Product Hunt's main "Comment" button to post your comment.

## Troubleshooting

* **"AI Gen" button not appearing?**
    * Ensure the extension is enabled in `chrome://extensions`.
    * Make sure you are on a `https://www.producthunt.com/` product page.
    * Try refreshing the Product Hunt page.
* **Error message like "API Key not configured"?**
    * Go back to the extension's "Options" page (Step 2) and ensure your OpenAI API Key is correctly entered and saved.
* **Error message related to "API Error" or "Network error"?**
    * This could mean there's an issue with your internet connection, the OpenAI API service itself, or your API key might be invalid or have insufficient credits. Check your OpenAI account status.
* **Generated comment doesn't appear in the editor OR the main "Comment" button doesn't enable?**