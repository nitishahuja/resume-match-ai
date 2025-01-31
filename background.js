chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Resume Matcher Extension Installed");

  // ✅ Set an initial API key (you can change this manually later)
  chrome.storage.local.get("OPENAI_API_KEY", (data) => {
    if (!data.OPENAI_API_KEY) {
      chrome.storage.local.set(
        {
          OPENAI_API_KEY: "XXXXX",
        },
        () => {
          console.log("🔑 Default API Key stored.");
        }
      );
    } else {
      console.log("✅ API Key already exists in storage.");
    }
  });
});

// ✅ Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getApiKey") {
    chrome.storage.local.get("OPENAI_API_KEY", (data) => {
      if (data.OPENAI_API_KEY) {
        console.log("🔑 Providing API Key to popup.js");
        sendResponse({ apiKey: data.OPENAI_API_KEY });
      } else {
        console.error("❌ API Key not found in storage.");
        sendResponse({ apiKey: null });
      }
    });
    return true; // Keep the message channel open for async response
  }

  if (request.action === "setApiKey") {
    if (request.apiKey) {
      chrome.storage.local.set({ OPENAI_API_KEY: request.apiKey }, () => {
        console.log("✅ API Key updated successfully.");
        sendResponse({ success: true });
      });
    } else {
      console.error("❌ Invalid API Key received.");
      sendResponse({ success: false });
    }
    return true;
  }
});
