// ✅ Initial injection check
console.log("✅ content.js injected!");

// Unified DOM ready handler
function initializeContentScript() {
  console.log("🏁 Starting content script execution");
  observeJobDescription(); // Start monitoring job description changes
}

// ✅ Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📩 Received message from popup.js:", request);

  if (request.action === "getJobDescription") {
    const jobDescription = extractJobDescription();

    if (jobDescription) {
      console.log(
        "✅ Found Job Description:",
        jobDescription.substring(0, 300),
        "..."
      );
    } else {
      console.error("❌ No Job Description found.");
    }

    sendResponse({ jobDescription: jobDescription || null });
    return true; // Keep the message channel open for async response
  }
});

// ✅ Improved Job Description Extraction
function extractJobDescription() {
  console.log("🔍 Extracting job description...");

  const selectors = [
    // LinkedIn
    "div.jobs-box__html-content",
    "div.show-more-less-html__markup",
    "section.description",
    "div.jobs-description-content__text--stretch",
    // Indeed
    "#jobDescriptionText",
    "div.job-description",
    // Glassdoor
    "div.jobDescriptionContent",
    // Monster
    "#JobDescription",
    // ZipRecruiter
    ".job_description",
    // Workday
    ".WDDF",
    // Greenhouse.io
    "div.job_description",
    "section.job-description",
    "#content div p",
    "#content div",
    "div#content",
    // Generic (catch-all)
    "[class*='job-description']",
    "[class*='jobDescription']",
    "[class*='description']",
    "[id*='job-description']",
    "[id*='jobDescription']",
    "[id*='description']",
    "article",
    "main",
    "[role='main']",
  ];

  let jobDescription = "";

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      jobDescription = element.innerText.trim().replace(/\s+/g, " "); // Clean extra spaces
      console.log(`✅ Job description found using selector: ${selector}`);
      break;
    }
  }

  if (!jobDescription) {
    console.error("❌ Job description not found using predefined selectors.");

    // Fallback: Try finding the largest text block
    const textBlocks = Array.from(document.querySelectorAll("p, div, section"))
      .map((el) => ({ el, text: el.innerText.trim() }))
      .filter(({ text }) => text.length > 100)
      .sort((a, b) => b.text.length - a.text.length);

    if (textBlocks.length > 0) {
      jobDescription = textBlocks[0].text;
      console.log("✅ Using largest detected text block as job description.");
    }
  }

  return jobDescription || null;
}

// ✅ Monitor Dynamic Job Description Loading (e.g., LinkedIn, Glassdoor)
function observeJobDescription() {
  console.log("👀 Watching for job description updates...");

  const observer = new MutationObserver(() => {
    const jobDescription = extractJobDescription();
    if (jobDescription) {
      console.log("✅ Job description detected dynamically!");
      observer.disconnect(); // Stop observing after we get the text
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// ✅ Start script based on document state
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeContentScript);
} else {
  initializeContentScript();
}
