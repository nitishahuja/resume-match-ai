import {
  loadPDFJS,
  extractTextFromPDF,
  getActiveTab,
  getJobDescription,
} from "./utils/utils.js";
import { analyzeWithAI } from "./utils/ai.js";
import { displayResults } from "./utils/ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ Popup loaded successfully");

  await loadPDFJS();

  const apiKeySection = document.getElementById("apiKeySection");
  const resumeSection = document.getElementById("resumeSection");
  const apiKeyInput = document.getElementById("apiKeyInput");
  const saveApiKeyBtn = document.getElementById("saveApiKey");
  const updateApiKeyBtn = document.getElementById("updateApiKey");
  const apiKeyStatus = document.getElementById("apiKeyStatus");

  // ✅ Check if API key exists
  async function checkApiKey() {
    try {
      const data = await chrome.storage.local.get("OPENAI_API_KEY");
      if (data.OPENAI_API_KEY) {
        console.log("🔑 API Key Found:", data.OPENAI_API_KEY);
        window.OPENAI_API_KEY = data.OPENAI_API_KEY;
        apiKeySection.style.display = "none"; // Hide API input
        resumeSection.style.display = "block"; // Show Resume Upload UI
      } else {
        console.log("❌ No API Key Found: Prompting User for Input");
        apiKeySection.style.display = "block"; // Show API input
        resumeSection.style.display = "none"; // Hide Resume Upload UI
      }
    } catch (error) {
      console.error("❌ Error retrieving API Key:", error);
    }
  }

  await checkApiKey();

  // ✅ Save API Key when user enters it
  saveApiKeyBtn.addEventListener("click", async () => {
    const key = apiKeyInput.value.trim();
    if (!key.startsWith("sk-")) {
      apiKeyStatus.textContent = "❌ Invalid API Key format.";
      return;
    }

    try {
      await chrome.storage.local.set({ OPENAI_API_KEY: key });
      console.log("✅ API Key Saved Successfully");
      apiKeyStatus.textContent = "✅ API Key Saved";
      window.OPENAI_API_KEY = key;
      apiKeySection.style.display = "none"; // Hide API input
      resumeSection.style.display = "block"; // Show Resume Upload UI
    } catch (error) {
      console.error("❌ Failed to Save API Key:", error);
      apiKeyStatus.textContent = "❌ Error saving API Key.";
    }
  });

  // ✅ Allow users to update their API key
  updateApiKeyBtn.addEventListener("click", async () => {
    try {
      await chrome.storage.local.remove("OPENAI_API_KEY");
      console.log("🔑 API Key Removed. Prompting for new key.");
      window.OPENAI_API_KEY = null;
      apiKeySection.style.display = "block"; // Show API Key input
      resumeSection.style.display = "none"; // Hide Resume Upload UI
    } catch (error) {
      console.error("❌ Error removing API Key:", error);
    }
  });

  // ✅ Ensure API key exists before running Match
  document.getElementById("matchBtn").addEventListener("click", async () => {
    try {
      const data = await chrome.storage.local.get("OPENAI_API_KEY");
      if (!data.OPENAI_API_KEY) {
        alert(
          "❌ API Key not set. Please enter your OpenAI API Key in settings."
        );
        return;
      }
      window.OPENAI_API_KEY = data.OPENAI_API_KEY;

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

        await chrome.storage.local.set({
          resumeData: resumeText,
          resumeFileName,
        });
        console.log("✅ Resume stored for future use.");

        document.getElementById(
          "resumeStatus"
        ).innerText = `✅ Resume Loaded: ${resumeFileName}`;
        document.getElementById("resumeUpload").disabled = true; // Disable upload
        document.getElementById("changeResumeBtn").style.display = "block"; // Show change button
      } else {
        const storedData = await chrome.storage.local.get([
          "resumeData",
          "resumeFileName",
        ]);
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
