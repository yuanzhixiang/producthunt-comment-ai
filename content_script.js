// content_script.js
console.log("Product Hunt AI Helper content script loaded.");

// Selector for the original Product Hunt "Comment" button
const PH_COMMENT_BUTTON_SELECTOR = 'button[data-test="form-submit-button"]';
// More specific selector for the Tiptap/ProseMirror editor area within the form
const PH_EDITOR_SELECTOR = 'div.ProseMirror[contenteditable="true"]';

function getPostContext() {
  let context = {
    productName: null,
    shortDescription: null,
    mainDescription: null,
    pricing: null,
    tags: [],
  };

  const headerImageSection = document.querySelector(
    'section[data-test="post-header-image"]'
  );

  if (headerImageSection) {
    const titleElement = headerImageSection.querySelector("h1");
    const descriptionElement = headerImageSection.querySelector("h1 + div");

    let titleText = titleElement ? titleElement.textContent.trim() : "";
    titleText = titleText.replace(/^\d+\.\s*/, "");
    const descriptionText = descriptionElement
      ? descriptionElement.textContent.trim()
      : "";

    context.productName = titleText;
    context.shortDescription = descriptionText;
  }

  const descriptionElement = document.querySelector(
    'div.prose[class*="text-16"][class*="text-dark-gray"]'
  );
  if (descriptionElement) {
    context.mainDescription = descriptionElement.textContent?.trim() || null;
  }

  const pricingElement = document.querySelector(
    'div[data-test="pricing-type"]'
  );
  if (pricingElement) {
    context.pricing = pricingElement.textContent?.trim() || null;
  }

  const tagListContainer = document.querySelector(
    'div[data-sentry-component="TagList"]'
  );
  if (tagListContainer) {
    tagListContainer
      .querySelectorAll('a[href^="/topics/"]')
      .forEach((tagElement) => {
        if (tagElement.textContent) {
          context.tags.push(tagElement.textContent.trim());
        }
      });
  }

  return context; // Return the structured object
}

// Function to find the associated editor for a given comment button
function findAssociatedEditor(commentButton) {
  const form = commentButton.closest('form[data-test="comment-form"]');
  if (form) {
    const editor = form.querySelector(PH_EDITOR_SELECTOR);
    if (editor) {
      return editor;
    }
  }
  // Fallback if the structure is unexpected, though less likely with the provided HTML
  console.warn(
    "Could not find editor within the form associated with the comment button."
  );
  return document.querySelector(PH_EDITOR_SELECTOR); // Last resort, might pick the wrong one if multiple forms exist
}

function addAiButton(commentButton) {
  // Unfollow the post
  const checkbox = document.querySelector(
    "div.styles_checkbox__HxLrG.styles_checked__7Q_rK"
  );
  if (checkbox) {
    checkbox.click();
    console.log("Checkbox clicked to unfollow.");
  }

  // Prevent adding duplicate buttons
  const buttonContainer = commentButton.parentElement;
  if (
    !buttonContainer ||
    buttonContainer.querySelector(".ai-generate-button-ph")
  ) {
    return;
  }

  const aiButton = document.createElement("button");
  aiButton.textContent = "✨ AI Gen";
  aiButton.className = "ai-generate-button-ph"; // Ensure styles are in content_script.css

  aiButton.addEventListener("click", async (event) => {
    event.preventDefault();
    aiButton.disabled = true;
    aiButton.textContent = "Generating...";

    const postContext = getPostContext();
    console.log("Post context:", postContext);

    try {
      const response = await chrome.runtime.sendMessage({
        action: "generateComment",
        postContext: postContext,
      });

      if (response.error) {
        console.error("AI Error:", response.error);
        alert(`Error: ${response.error}`);
      } else if (response.comment) {
        const editorElement = findAssociatedEditor(commentButton);

        if (editorElement) {
          console.log("Editor found:", editorElement);

          // For contenteditable divs (like ProseMirror)
          editorElement.focus(); // Focus the editor

          // Clear existing placeholder content if it's the default empty <p><br></p>
          const firstParagraph =
            editorElement.querySelector("p.is-editor-empty");
          if (
            firstParagraph &&
            editorElement.children.length === 1 &&
            firstParagraph.innerHTML.toLowerCase() ===
              '<br class="prosemirror-trailingbreak">'
          ) {
            editorElement.innerHTML = ""; // Clear it
          }

          // Create a new paragraph with the comment
          const newParagraph = document.createElement("p");
          newParagraph.textContent = response.comment;
          editorElement.appendChild(newParagraph);

          // Attempt to trigger input events that Product Hunt's JS might listen to
          // This is often necessary for the site to recognize the change.
          editorElement.dispatchEvent(
            new Event("input", { bubbles: true, cancelable: true })
          );
          editorElement.dispatchEvent(
            new Event("change", { bubbles: true, cancelable: true })
          );
          editorElement.dispatchEvent(
            new KeyboardEvent("keydown", { bubbles: true })
          ); // Simulate some activity
          editorElement.dispatchEvent(
            new KeyboardEvent("keyup", { bubbles: true })
          );
        } else {
          console.warn(
            "Could not find Product Hunt editor using selector:",
            PH_EDITOR_SELECTOR
          );
          alert(
            "Editor not found. Comment: " +
              response.comment +
              " (copied to clipboard)"
          );
          navigator.clipboard
            .writeText(response.comment)
            .catch((err) => console.error("Copy failed: ", err));
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

  // Insert the AI button BEFORE the original Product Hunt "Comment" button
  commentButton.parentNode.insertBefore(aiButton, commentButton);
  // console.log("AI Generate button added to the left of:", commentButton);
}

function observeAndAddButtons() {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    // Query for all potential comment submission buttons on the page
    document.querySelectorAll(PH_COMMENT_BUTTON_SELECTOR).forEach((button) => {
      // Check if the button is part of a comment form we can identify
      const form = button.closest('form[data-test="comment-form"]');
      if (form) {
        // Check if our AI button already exists within this specific form's button container
        const buttonContainer = button.parentElement;
        if (
          buttonContainer &&
          !buttonContainer.querySelector(".ai-generate-button-ph")
        ) {
          addAiButton(button);
        }
      }
    });
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  // Initial check
  document.querySelectorAll(PH_COMMENT_BUTTON_SELECTOR).forEach((button) => {
    const form = button.closest('form[data-test="comment-form"]');
    if (form) {
      addAiButton(button);
    }
  });
}

// Start observing when the content script loads
observeAndAddButtons();
