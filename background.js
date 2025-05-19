// Function to get API configuration from storage
async function getApiConfig() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["apiKey", "baseUrl"], (items) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting API config from storage:",
          chrome.runtime.lastError.message
        );
        resolve({ apiKey: null, baseUrl: null });
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
      const { apiKey, baseUrl } = await getApiConfig();

      if (!apiKey) {
        sendResponse({
          error:
            "OpenAI API Key is not configured. Please set it in the extension options.",
        });
        return;
      }

      let constBaseUrl;
      if (baseUrl) {
        constBaseUrl = baseUrl;
      } else {
        constBaseUrl = "https://api.openai.com";
      }

      const apiUrl = constBaseUrl + "/v1/chat/completions";

      let postContext = request.postContext;
      if (!postContext) {
        sendResponse({ error: "Post context is missing." });
        return;
      }

      const userPrompt = `Please generate a brief Product Hunt-style review for the following product:\n\n${JSON.stringify(postContext)}`;
      const messages = [
        {
          role: "system",
          content: "Based on the input product information (link or text), generate a Product Hunt style review in English. Requirements: 1-2 sentences, first-person, praise-only and specific (highlighting features/design/benefits and connecting to user pain points), authentic and enthusiastic tone, no emojis or suggestions for improvement. Output only the review text."
        },
        {
          role: "user",
          content: userPrompt,
        },
      ];

      const requestBody = {
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        // stream: false, // Set to true and handle differently if you want streaming
      };

      console.log("Sending to AI API:", apiUrl);
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        });

        let responseData;

        if (!response.ok) {
          console.error("AI API Error:", response.status);
          const errorMessage =
            response.statusText ||
            "Unknown API error";
          sendResponse({
            error: `API Error (${response.status}): ${errorMessage}`,
          });
          return;
        }

        try {
            responseData = await response.json();
        } catch (error) {
            const text = await response.text();
            console.error("Error parsing AI API response:", text, error);
            sendResponse({ error: "Invalid JSON response from AI API." });
            return;
        }

        // Extract the generated text from OpenAI's Chat Completions response
        const generatedComment =
          responseData.choices &&
          responseData.choices[0] &&
          responseData.choices[0].message &&
          responseData.choices[0].message.content
            ? responseData.choices[0].message.content.trim()
            : "Could not extract comment from API response.";

        sendResponse({ comment: generatedComment });
      } catch (error) {
        console.error("Error calling AI API:", error);
        sendResponse({ error: `Network or other error: ${error.message}` });
      }
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
