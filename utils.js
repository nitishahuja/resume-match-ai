// ✅ Load PDF.js
export const loadPDFJS = () => {
  return new Promise((resolve) => {
    if (typeof pdfjsLib !== "undefined") {
      console.log("📜 PDF.js already loaded");
      return resolve();
    }

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("libs/pdf.min.js");
    script.onload = () => {
      console.log("📜 PDF.js loaded successfully");
      resolve();
    };
    script.onerror = () => {
      console.error("❌ Failed to load PDF.js");
      resolve();
    };
    document.head.appendChild(script);
  });
};

// ✅ Extract text from PDF
export const extractTextFromPDF = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const typedArray = new Uint8Array(reader.result);
      pdfjsLib
        .getDocument(typedArray)
        .promise.then((pdf) => {
          const pages = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            pages.push(
              pdf.getPage(i).then((page) =>
                page.getTextContent().then((content) => {
                  return content.items.map((item) => item.str).join(" ");
                })
              )
            );
          }
          Promise.all(pages)
            .then((textArray) => resolve(textArray.join(" ")))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    };
    reader.readAsArrayBuffer(file);
  });
};

// ✅ Get active browser tab
export const getActiveTab = () => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Tab error:", chrome.runtime.lastError);
        resolve(null);
      } else {
        resolve(tab);
      }
    });
  });
};

// ✅ Fetch job description from content.js
export const getJobDescription = async (tabId) => {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      { target: { tabId }, files: ["content.js"] },
      () => {
        console.log("🔄 Injected content script dynamically.");

        chrome.tabs.sendMessage(
          tabId,
          { action: "getJobDescription" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                "❌ Content script error:",
                chrome.runtime.lastError
              );
              resolve(null);
            } else {
              resolve(response?.jobDescription || null);
            }
          }
        );
      }
    );
  });
};
