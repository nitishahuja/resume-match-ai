console.log("Content script injected and running...");

function extractJobDescription() {
  console.log("Extracting job description...");

  let jobDescription = "";
  const selectors = [
    "div.description__text",
    "div.show-more-less-html__markup",
    "section.description",
    '[class*="job-description"]', // Generic class-based selector
    '[class*="description"]', // More variations
    "div.jobs-description__content", // Another common LinkedIn selector
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      jobDescription = element.innerText.trim();
      console.log("✅ Job description found:", jobDescription);
      break;
    }
  }

  if (!jobDescription) {
    console.error("❌ Job description not found using predefined selectors.");
  }

  return jobDescription;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📩 Received message from popup.js:", request);

  if (request.action === "getJobDescription") {
    const jobDescription = extractJobDescription();
    sendResponse({ jobDescription });

    if (jobDescription) {
      console.log("✅ Sent job description back to popup.js.");
    } else {
      console.error("❌ Failed to extract job description.");
    }
  }
});
