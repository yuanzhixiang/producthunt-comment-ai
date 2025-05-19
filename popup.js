// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("inputText");
  const generateButton = document.getElementById("generateButton");
  const commentOutput = document.getElementById("commentOutput");
  const loadingIndicator = document.getElementById("loadingIndicator");

  generateButton.addEventListener("click", async () => {
    const text = inputText.value;
    if (!text.trim()) {
      commentOutput.textContent = "Please enter some text or a topic.";
      return;
    }

    loadingIndicator.style.display = "block";
    commentOutput.textContent = ""; // Clear previous result

    try {
      // Send a message to the background script
      const response = await chrome.runtime.sendMessage({
        action: "generateComment",
        promptText: text,
        // You can add more parameters like tone, length here if needed
      });

      if (response.error) {
        commentOutput.textContent = `Error: ${response.error}`;
        console.error("Error from background:", response.error);
      } else if (response.comment) {
        commentOutput.textContent = response.comment;
      } else {
        commentOutput.textContent =
          "No comment received or an unknown error occurred.";
      }
    } catch (error) {
      commentOutput.textContent = `Error communicating with background: ${error.message}`;
      console.error("Error sending message to background:", error);
    } finally {
      loadingIndicator.style.display = "none";
    }
  });
});
