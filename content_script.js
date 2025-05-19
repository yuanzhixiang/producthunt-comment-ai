// content_script.js
console.log("Product Hunt AI Helper content script loaded.");

// Selector for the original Product Hunt "Comment" button
const PH_COMMENT_BUTTON_SELECTOR = 'button[data-test="form-submit-button"]';
// More specific selector for the Tiptap/ProseMirror editor area within the form
const PH_EDITOR_SELECTOR = 'div.ProseMirror[contenteditable="true"]';

function getPostContext() {
    // Attempt to get a more relevant product title or description
    const productTitleElement = document.querySelector('h1[class*="title"], h2[class*="title"]'); // Common title classes
    let contextText = "Regarding the product ";
    if (productTitleElement) {
        contextText += `"${productTitleElement.textContent.trim()}"`;
    } else {
        // Fallback to OpenGraph title or page title if H1/H2 not found or not specific enough
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && ogTitle.content) {
            contextText += `"${ogTitle.content.trim()}"`;
        } else {
            contextText += `titled "${document.title}"`;
        }
    }
    return contextText;
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
    console.warn("Could not find editor within the form associated with the comment button.");
    return document.querySelector(PH_EDITOR_SELECTOR); // Last resort, might pick the wrong one if multiple forms exist
}


function addAiButton(commentButton) {
    // Prevent adding duplicate buttons
    const buttonContainer = commentButton.parentElement;
    if (!buttonContainer || buttonContainer.querySelector(".ai-generate-button-ph")) {
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
        const topic = `Write a supportive and insightful comment for Product Hunt ${postContext}. Your comment should be engaging and relevant to the product.`;

        try {
            const response = await chrome.runtime.sendMessage({
                action: "generateComment",
                promptText: topic,
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
                    const firstParagraph = editorElement.querySelector('p.is-editor-empty');
                    if (firstParagraph && editorElement.children.length === 1 && firstParagraph.innerHTML.toLowerCase() === '<br class="prosemirror-trailingbreak">') {
                        editorElement.innerHTML = ''; // Clear it
                    }

                    // Create a new paragraph with the comment
                    const newParagraph = document.createElement('p');
                    newParagraph.textContent = response.comment;
                    editorElement.appendChild(newParagraph);


                    // Attempt to trigger input events that Product Hunt's JS might listen to
                    // This is often necessary for the site to recognize the change.
                    editorElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    editorElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true })); // Simulate some activity
                    editorElement.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

                    // Fallback: Copy to clipboard as a less invasive method if direct input is problematic
                    // You might still want to keep this as an option or if direct input fails.
                    /*
                    navigator.clipboard.writeText(response.comment).then(() => {
                        alert("Comment generated and copied to clipboard! Paste it into the comment box.");
                    }).catch(err => {
                        console.error("Failed to copy to clipboard: ", err);
                        alert("Comment generated (see console), but failed to copy to clipboard.");
                        console.log("Generated comment:", response.comment);
                    });
                    */

                } else {
                    console.warn("Could not find Product Hunt editor using selector:", PH_EDITOR_SELECTOR);
                    alert("Editor not found. Comment: " + response.comment + " (copied to clipboard)");
                    navigator.clipboard.writeText(response.comment).catch(err => console.error("Copy failed: ", err));
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
    console.log("AI Generate button added to the left of:", commentButton);
}

function observeAndAddButtons() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = function (mutationsList, observer) {
        // Query for all potential comment submission buttons on the page
        document.querySelectorAll(PH_COMMENT_BUTTON_SELECTOR).forEach(button => {
            // Check if the button is part of a comment form we can identify
            const form = button.closest('form[data-test="comment-form"]');
            if (form) {
                // Check if our AI button already exists within this specific form's button container
                const buttonContainer = button.parentElement;
                if (buttonContainer && !buttonContainer.querySelector(".ai-generate-button-ph")) {
                    addAiButton(button);
                }
            }
        });
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    // Initial check
    document.querySelectorAll(PH_COMMENT_BUTTON_SELECTOR).forEach(button => {
        const form = button.closest('form[data-test="comment-form"]');
        if (form) {
           addAiButton(button);
        }
    });
}

// Start observing when the content script loads
observeAndAddButtons();