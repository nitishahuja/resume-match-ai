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

  const resumeUpload = document.getElementById("resumeUpload");
  const resumeStatus = document.getElementById("resumeStatus");
  const changeResumeBtn = document.getElementById("changeResumeBtn");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const matchBtn = document.getElementById("matchBtn");

  // ✅ Restore stored resume on extension load
  async function restoreStoredResume() {
    try {
      const storedData = await chrome.storage.local.get([
        "resumeData",
        "resumeFileName",
      ]);
      if (storedData.resumeData && storedData.resumeFileName) {
        console.log("📄 Restoring saved resume:", storedData.resumeFileName);
        resumeStatus.innerText = `✅ Resume Loaded: ${storedData.resumeFileName}`;
        resumeUpload.disabled = true;
        changeResumeBtn.style.display = "block";
      } else {
        console.log("❌ No stored resume found.");
        resumeStatus.innerText = "No resume uploaded";
        changeResumeBtn.style.display = "none";
      }
    } catch (error) {
      console.error("❌ Error retrieving stored resume:", error);
      resumeStatus.innerText = "❌ Error fetching resume. Try uploading again.";
    }
  }

  // ✅ Check if API key exists
  async function checkApiKey() {
    try {
      const data = await chrome.storage.local.get("OPENAI_API_KEY");
      if (data.OPENAI_API_KEY) {
        console.log("🔑 API Key Found:", data.OPENAI_API_KEY);
        window.OPENAI_API_KEY = data.OPENAI_API_KEY;
        apiKeySection.style.display = "none";
        resumeSection.style.display = "block";
      } else {
        console.log("❌ No API Key Found: Prompting User for Input");
        apiKeySection.style.display = "block";
        resumeSection.style.display = "none";
      }
    } catch (error) {
      console.error("❌ Error retrieving API Key:", error);
    }
  }

  await checkApiKey();
  await restoreStoredResume();

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
      apiKeySection.style.display = "none";
      resumeSection.style.display = "block";
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
      apiKeySection.style.display = "block";
      resumeSection.style.display = "none";
    } catch (error) {
      console.error("❌ Error removing API Key:", error);
    }
  });

  // ✅ Handle Resume Upload
  resumeUpload.addEventListener("change", async () => {
    const file = resumeUpload.files[0];
    if (!file) return;

    console.log("📄 File selected:", file.name);
    loadingSpinner.style.display = "block";

    try {
      const resumeText = await extractTextFromPDF(file);
      console.log(
        "✅ Extracted Resume Text:",
        resumeText.substring(0, 300),
        "..."
      );

      await chrome.storage.local.set({
        resumeData: resumeText,
        resumeFileName: file.name,
      });

      console.log("✅ Resume stored for future use.");
      resumeStatus.innerText = `✅ Resume Loaded: ${file.name}`;
      resumeUpload.disabled = true;
      changeResumeBtn.style.display = "block";
    } catch (error) {
      console.error("❌ Error extracting resume:", error);
      alert("Failed to process the resume. Please try again.");
    } finally {
      loadingSpinner.style.display = "none";
    }
  });

  // ✅ Change Resume Button Click
  changeResumeBtn.addEventListener("click", async () => {
    await chrome.storage.local.remove(["resumeData", "resumeFileName"]);
    console.log("📄 Resume cleared.");
    resumeStatus.innerText = "No resume uploaded";
    resumeUpload.disabled = false;
    resumeUpload.value = "";
    changeResumeBtn.style.display = "none";
  });

  // ✅ Match Resume Button Click
  matchBtn.addEventListener("click", async () => {
    try {
      const data = await chrome.storage.local.get([
        "OPENAI_API_KEY",
        "resumeData",
        "resumeFileName",
      ]);
      console.log("🔍 Matching process initiated with data:", data);
      if (!data.OPENAI_API_KEY) {
        alert("❌ API Key not set. Please enter your OpenAI API Key.");
        return;
      }
      if (!data.resumeData) {
        alert("❌ No resume available. Please upload one.");
        return;
      }

      window.OPENAI_API_KEY = data.OPENAI_API_KEY;

      console.log("🔍 Match button clicked");
      loadingSpinner.style.display = "block";

      const tab = await getActiveTab();
      if (!tab) {
        alert("❌ No active tab found. Please open a job posting page.");
        return;
      }

      const jobDescription = await getJobDescription(tab.id);
      if (!jobDescription) {
        alert("❌ Failed to retrieve job description.");
        return;
      }

      console.log(
        "✅ Job description retrieved:",
        jobDescription.substring(0, 300),
        "..."
      );

      const analysis = await analyzeWithAI(data.resumeData, jobDescription);
      if (!analysis) {
        alert("❌ Failed to analyze resume. Please try again.");
        return;
      }

      displayResults(analysis);
    } catch (error) {
      console.error("❌ Error processing resume:", error);
      alert("❌ Failed to process the resume. Please try again.");
    } finally {
      loadingSpinner.style.display = "none";
    }
  });

  document
    .getElementById("copyResumeSnippets")
    .addEventListener("click", () => {
      const snippetsText = document.getElementById("resumeSnippets").value;
      if (snippetsText.trim()) {
        navigator.clipboard.writeText(snippetsText).then(() => {
          alert("📋 Resume Snippets copied to clipboard!");
        });
      } else {
        alert("❌ No resume snippets available to copy.");
      }
    });

  // ✅ Copy Insights to Clipboard
  document.getElementById("copyInsights").addEventListener("click", () => {
    const insightsText = document.getElementById("resumeInsights").value;
    if (insightsText.trim()) {
      navigator.clipboard.writeText(insightsText).then(() => {
        alert("📋 Insights copied to clipboard!");
      });
    } else {
      alert("❌ No insights available to copy.");
    }
  });
});
