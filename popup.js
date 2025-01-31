import {
  loadPDFJS,
  extractTextFromPDF,
  getActiveTab,
  getJobDescription,
} from "./utils.js";
import { analyzeWithAI } from "./ai.js";
import { displayResults } from "./ui.js";

// ✅ Load PDF.js and API Key on startup
document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ Popup loaded successfully");

  await loadPDFJS();

  chrome.runtime.sendMessage({ action: "getApiKey" }, (response) => {
    if (response?.apiKey) {
      window.OPENAI_API_KEY = response.apiKey;
      console.log("🔑 API Key loaded successfully");
    } else {
      console.error("❌ API Key not found. Please set it.");
      alert("API Key missing! Set it in extension settings.");
    }
  });

  // ✅ Match Resume Button Click
  document.getElementById("matchBtn").addEventListener("click", async () => {
    console.log("🔍 Match button clicked");

    const fileInput = document.getElementById("resumeUpload");
    if (fileInput.files.length === 0) {
      alert("Please upload your resume.");
      return;
    }

    const file = fileInput.files[0];
    console.log("📄 File selected:", file.name);

    document.getElementById("loadingSpinner").style.display = "block";

    try {
      // ✅ Extract Resume Text
      const resumeText = await extractTextFromPDF(file);
      console.log(
        "✅ Extracted Resume Text:",
        resumeText.substring(0, 300),
        "..."
      );

      // ✅ Store Resume in Chrome Storage
      chrome.storage.local.set({ resumeData: resumeText });

      // ✅ Get Active Tab
      const tab = await getActiveTab();
      if (!tab) {
        alert("No active tab found. Please open a job posting page.");
        return;
      }

      // ✅ Fetch Job Description from Active Tab
      const jobDescription = await getJobDescription(tab.id);
      if (!jobDescription) {
        alert(
          "Failed to retrieve job description. Ensure you're on a job posting page."
        );
        return;
      }

      console.log(
        "✅ Job description retrieved:",
        jobDescription.substring(0, 300),
        "..."
      );

      // ✅ Analyze Resume & Fetch Everything (Match Score, Skills, & Resume Fixes)
      const analysis = await analyzeWithAI(resumeText, jobDescription);
      if (!analysis) {
        alert("Failed to analyze resume. Please try again.");
        return;
      }

      // ✅ Display Everything in UI (Match Score, Skills, Resume Fixes)
      displayResults(analysis);

      // ✅ Store Missing Skills for Future Use
      chrome.storage.local.set({ missingSkills: analysis.missing_skills });
    } catch (error) {
      console.error("❌ Error processing resume:", error);
      alert("Failed to process the resume. Please try again.");
    } finally {
      document.getElementById("loadingSpinner").style.display = "none";
    }
  });
});
