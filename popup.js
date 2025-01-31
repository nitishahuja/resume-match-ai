import {
  loadPDFJS,
  extractTextFromPDF,
  getActiveTab,
  getJobDescription,
} from "./utils/utils.js";
import { analyzeWithAI } from "./utils/ai.js";
import { displayResults } from "./utils/ui.js";

// ✅ Load PDF.js and Resume from Storage on Startup
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

  // ✅ Restore last uploaded resume if available
  chrome.storage.local.get(["resumeData", "resumeFileName"], (data) => {
    if (data.resumeData) {
      console.log("📄 Restoring saved resume...");
      document.getElementById(
        "resumeStatus"
      ).innerText = `✅ Resume Loaded: ${data.resumeFileName}`;
      document.getElementById("resumeUpload").disabled = true; // Disable upload initially
      document.getElementById("changeResumeBtn").style.display = "block"; // Show change button
    }
  });

  // ✅ Change Resume Button Click - Allow Uploading a New File
  document.getElementById("changeResumeBtn").addEventListener("click", () => {
    document.getElementById("resumeUpload").disabled = false;
    document.getElementById("resumeUpload").value = ""; // Reset input
    document.getElementById("resumeStatus").innerText = "Upload a new resume:";
    document.getElementById("changeResumeBtn").style.display = "none"; // Hide change button
  });

  // ✅ Match Resume Button Click
  document.getElementById("matchBtn").addEventListener("click", async () => {
    console.log("🔍 Match button clicked");

    const fileInput = document.getElementById("resumeUpload");

    if (!fileInput.disabled && fileInput.files.length === 0) {
      alert("Please upload your resume.");
      return;
    }

    const file = fileInput.files[0];

    if (file) {
      console.log("📄 File selected:", file.name);
    } else {
      console.log("📄 Using stored resume from previous session.");
    }

    document.getElementById("loadingSpinner").style.display = "block";

    try {
      let resumeText;
      let resumeFileName;

      if (file) {
        resumeText = await extractTextFromPDF(file);
        resumeFileName = file.name;

        console.log(
          "✅ Extracted Resume Text:",
          resumeText.substring(0, 300),
          "..."
        );

        // ✅ Store resume in Chrome Storage for persistence
        chrome.storage.local.set(
          { resumeData: resumeText, resumeFileName },
          () => {
            console.log("✅ Resume stored for future use.");
          }
        );

        document.getElementById(
          "resumeStatus"
        ).innerText = `✅ Resume Loaded: ${resumeFileName}`;
        document.getElementById("resumeUpload").disabled = true; // Disable upload
        document.getElementById("changeResumeBtn").style.display = "block"; // Show change button
      } else {
        // ✅ Load stored resume if no new file is uploaded
        const storedData = await new Promise((resolve) =>
          chrome.storage.local.get(["resumeData", "resumeFileName"], resolve)
        );

        if (!storedData.resumeData) {
          alert("No resume available. Please upload one.");
          return;
        }

        resumeText = storedData.resumeData;
        resumeFileName = storedData.resumeFileName;
      }

      const tab = await getActiveTab();
      if (!tab) {
        alert("No active tab found. Please open a job posting page.");
        return;
      }

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

      const analysis = await analyzeWithAI(resumeText, jobDescription);
      if (!analysis) {
        alert("Failed to analyze resume. Please try again.");
        return;
      }

      displayResults(analysis);
    } catch (error) {
      console.error("❌ Error processing resume:", error);
      alert("Failed to process the resume. Please try again.");
    } finally {
      document.getElementById("loadingSpinner").style.display = "none";
    }
  });
});
