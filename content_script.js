// content_script.js
console.log("Product Hunt AI Helper content script loaded.");

const PH_COMMENT_BUTTON_SELECTOR = 'button[data-test="form-submit-button"]';
const PH_TEXTAREA_SELECTOR = ".rta__textarea"; // Common class for their rich text area

function getPostContext() {
  // This is a simplified context grabber.
  // For Product Hunt, you might want to grab the product title or description.
  // Example: Find the main product title
  const productTitleElement = document.querySelector("h1"); // This is a guess, inspect PH for actual selectors
  let contextText = "Regarding the product ";
  if (productTitleElement) {
    contextText += `"${productTitleElement.textContent.trim()}"`;
  } else {
    contextText += "being discussed";
  }
  return contextText;
}

function addAiButton(commentButton) {
  if (commentButton.parentElement.querySelector(".ai-generate-button-ph")) {
    // Button already exists
    return;
  }

  const aiButton = document.createElement("button");
  aiButton.textContent = "✨ AI Gen";
  aiButton.className = "ai-generate-button-ph";

  aiButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent any default form submission
    aiButton.disabled = true;
    aiButton.textContent = "Generating...";

    const postContext = getPostContext(); // Get some context from the page
    // TODO This is prompt
    const topic = `Write a supportive and insightful comment for Product Hunt ${postContext}.`;

    try {
      const response = await chrome.runtime.sendMessage({
        action: "generateComment",
        promptText: topic, // Send this topic to your AI
      });

      if (response.error) {
        console.error("AI Error:", response.error);
        alert(`Error: ${response.error}`);
        // Potentially update a status area instead of alert
      } else if (response.comment) {
        const textarea = commentButton
          .closest("form")
          ?.querySelector(PH_TEXTAREA_SELECTOR);
        if (textarea) {
          // For simple textareas:
          // textarea.value = response.comment;
          // textarea.dispatchEvent(new Event('input', { bubbles: true })); // Notify PH of change

          // For rich text editors (like Product Hunt's likely is),
          // direct value assignment might not work.
          // You might need to simulate typing or use clipboard.
          // This is the most complex part and highly site-specific.
          // As a fallback, you can copy to clipboard and notify the user.
          navigator.clipboard
            .writeText(response.comment)
            .then(() => {
              alert(
                "Comment generated and copied to clipboard! Paste it into the text area."
              );
            })
            .catch((err) => {
              console.error("Failed to copy: ", err);
              alert(
                "Comment generated, but failed to copy to clipboard. See console."
              );
              console.log("Generated comment:", response.comment);
            });
        } else {
          console.warn(
            "Could not find Product Hunt textarea with selector:",
            PH_TEXTAREA_SELECTOR
          );
          alert("Textarea not found. Comment: " + response.comment);
        }
      }
    } catch (error) {
      console.error("Error communicating with background:", error);
      alert(`Error: ${error.message}`);
    } finally {
      aiButton.disabled = false;
      aiButton.textContent = "✨ AI Gen";
    }
  });

  // Insert the AI button after the original comment button
  commentButton.parentNode.insertBefore(aiButton, commentButton);
  console.log("AI Generate button added next to:", commentButton);
}

function observeAndAddButtons() {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    const commentButtons = document.querySelectorAll(
      PH_COMMENT_BUTTON_SELECTOR
    );
    commentButtons.forEach((button) => {
      // Check if our button is already there to avoid duplicates
      if (!button.parentNode.querySelector(".ai-generate-button-ph")) {
        addAiButton(button);
      }
    });
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  // Initial check in case buttons are already present
  const initialCommentButtons = document.querySelectorAll(
    PH_COMMENT_BUTTON_SELECTOR
  );
  initialCommentButtons.forEach(addAiButton);
}

// Start observing when the content script loads
observeAndAddButtons();
