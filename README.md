# 🚀 Product Hunt AI Comment Helper - User Guide

This Chrome extension helps you effortlessly generate insightful, AI-powered comments on Product Hunt submissions.

---

## 🎬 Video Tutorial (Recommended)

Watch this quick tutorial demonstrating setup and usage:

![▶️ Watch Video Tutorial](https://github.com/yuanzhixiang/producthunt-comment-ai/raw/develop/20250519/support_openai/tutorial.mp4)

## 📦 Installation

Clone the repository:

```bash
git clone [repository URL]
```

Then, load the extension:

1. Enter `chrome://extensions` in the Chrome address bar and press **Enter**.
2. Toggle **Developer mode** (top-right corner) to **ON**.
3. Click **Load unpacked** and select the cloned repository folder.

The **Product Hunt AI Comment Helper** icon should now appear in your Chrome toolbar.

---

## 🔑 Configuration (Required)

Before using the AI features, configure your OpenAI API Key:

### 1. Open Options Page

* Right-click the extension's toolbar icon.
* Select **Options**.

Alternatively:

* On `chrome://extensions`, find the extension, click **Details**, then **Extension options**.

### 2. Enter API Key

* Paste your OpenAI API Key into the **AI API Key** field.

### 3. API Endpoint (Optional)

* The default API endpoint is `https://api.openai.com/v1/chat/completions`.
* Only modify this if using a proxy or alternative endpoint.

### 4. Save Settings

* Click **Save Settings** and look for the "Settings saved!" confirmation.

---

## ✨ Using the Extension on Product Hunt

### 1. Visit Product Hunt

* Navigate to a product page (`https://www.producthunt.com`).

### 2. Scroll to Comment Section

* Find the area where comments are typically written.

### 3. Use the "✨ AI Gen" Button

* Click the **✨ AI Gen** button next to Product Hunt's "Comment" button.
* Button status changes to "Generating..." while processing.

### 4. AI Generates Your Comment

* The extension uses product details (name, tagline, description) automatically to create an insightful comment.

### 5. Submit

* Click Product Hunt’s original **Comment** button to publish your comment.

---

🎉 **Happy Commenting!**
