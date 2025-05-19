// background.js

// Function to get API configuration from storage
async function getApiConfig() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["aiApiKey", "aiApiUrl"], (items) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting API config from storage:",
          chrome.runtime.lastError.message
        );
        resolve({ aiApiKey: null, aiApiUrl: null });
        return;
      }
      resolve(items);
    });
  });
}

// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateComment") {
    (async () => {
      const { aiApiKey, aiApiUrl } = await getApiConfig();

    //   if (!aiApiKey) {
    //     sendResponse({
    //       error:
    //         "OpenAI API Key is not configured. Please set it in the extension options.",
    //     });
    //     return;
    //   }

    //   // Use a default OpenAI-compatible URL if not set, or allow user to override
    //   const apiUrl = aiApiUrl || "https://api.openai.com/v1/chat/completions"; // Default OpenAI endpoint

    //   let promptText = request.promptText;
    //   if (!promptText) {
    //     sendResponse({ error: "Prompt text is missing." });
    //     return;
    //   }

    //   // Constructing a prompt for OpenAI Chat Completions
    //   // You might want to pass 'tone', 'length', 'social' from the content script
    //   // and incorporate them into the system or user message.
    //   const messages = [
    //     {
    //       role: "system",
    //       content:
    //         "You are a helpful assistant that generates insightful and relevant social media comments. " +
    //         (request.social ? `The comment is for ${request.social}. ` : "") +
    //         (request.tone && request.tone !== "0"
    //           ? `The desired tone is ${request.toneLabel}. `
    //           : "") +
    //         (request.length && request.length !== "0"
    //           ? `The desired length is ${request.lengthLabel}. `
    //           : "") +
    //         (request.language && request.language !== "0"
    //           ? `Please respond in ${request.languageLabel}. `
    //           : "Respond in English."),
    //     },
    //     {
    //       role: "user",
    //       content: promptText,
    //     },
    //   ];

    //   const requestBody = {
    //     model: "gpt-3.5-turbo", // Or any other model you prefer, e.g., "gpt-4"
    //     messages: messages,
    //     max_tokens:
    //       request.length === "1" ? 50 : request.length === "3" ? 200 : 100, // Example: map length to tokens
    //     temperature: 0.7,
    //     // stream: false, // Set to true and handle differently if you want streaming
    //   };

    //   console.log("Sending to AI API:", apiUrl);
    //   console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    //   try {
    //     const response = await fetch(apiUrl, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${aiApiKey}`,
    //       },
    //       body: JSON.stringify(requestBody),
    //     });

    //     const responseData = await response.json();

    //     if (!response.ok) {
    //       console.error("AI API Error:", response.status, responseData);
    //       const errorMessage =
    //         responseData.error?.message ||
    //         response.statusText ||
    //         "Unknown API error";
    //       sendResponse({
    //         error: `API Error (${response.status}): ${errorMessage}`,
    //       });
    //       return;
    //     }

    //     // Extract the generated text from OpenAI's Chat Completions response
    //     const generatedComment =
    //       responseData.choices &&
    //       responseData.choices[0] &&
    //       responseData.choices[0].message &&
    //       responseData.choices[0].message.content
    //         ? responseData.choices[0].message.content.trim()
    //         : "Could not extract comment from API response.";

    //     sendResponse({ comment: generatedComment });
    //   } catch (error) {
    //     console.error("Error calling AI API:", error);
    //     sendResponse({ error: `Network or other error: ${error.message}` });
    //   }
      sendResponse({ comment: "Hello, " + aiApiKey}); 
    })();
    return true; // Indicates that sendResponse will be called asynchronously
  }
});

// Optional: Open options page on first install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      // Fallback for older browsers or if openOptionsPage is not available
      window.open(chrome.runtime.getURL("options.html"));
    }
  }
});

console.log("AI Comment Helper background script loaded.");
