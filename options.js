// options.js
document.addEventListener("DOMContentLoaded", () => {
  const baseUrlInput = document.getElementById("baseUrl");
  const apiKeyInput = document.getElementById("apiKey");
  const saveButton = document.getElementById("saveButton");
  const statusMessage = document.getElementById("statusMessage");

  // Load saved settings
  chrome.storage.sync.get(["baseUrl", "apiKey"], (items) => {
    if (items.baseUrl) {
      baseUrlInput.value = items.baseUrl;
    }
    if (items.apiKey) {
      apiKeyInput.value = items.apiKey;
    }
  });

  // Save settings
  saveButton.addEventListener("click", () => {
    const baseUrl = baseUrlInput.value;
    const apiKey = apiKeyInput.value;

    if (!baseUrl || !apiKey) {
      statusMessage.textContent = "Error: Base URL and API Key cannot be empty.";
      statusMessage.style.color = "red";
      return;
    }

    chrome.storage.sync.set(
      {
        baseUrl: baseUrl,
        aiApiKey: apiKey,
      },
      () => {
        statusMessage.textContent = "Settings saved!";
        statusMessage.style.color = "green";
        setTimeout(() => {
          statusMessage.textContent = "";
        }, 3000);
      }
    );
  });
});
