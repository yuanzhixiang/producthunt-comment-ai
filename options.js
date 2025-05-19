// options.js
document.addEventListener("DOMContentLoaded", () => {
  const apiUrlInput = document.getElementById("apiUrl");
  const apiKeyInput = document.getElementById("apiKey");
  const saveButton = document.getElementById("saveButton");
  const statusMessage = document.getElementById("statusMessage");

  // Load saved settings
  chrome.storage.sync.get(["aiApiUrl", "aiApiKey"], (items) => {
    if (items.aiApiUrl) {
      apiUrlInput.value = items.aiApiUrl;
    }
    if (items.aiApiKey) {
      apiKeyInput.value = items.aiApiKey;
    }
  });

  // Save settings
  saveButton.addEventListener("click", () => {
    const apiUrl = apiUrlInput.value;
    const apiKey = apiKeyInput.value;

    if (!apiUrl || !apiKey) {
      statusMessage.textContent = "Error: API URL and API Key cannot be empty.";
      statusMessage.style.color = "red";
      return;
    }

    chrome.storage.sync.set(
      {
        aiApiUrl: apiUrl,
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
