document.addEventListener("DOMContentLoaded", function () {
  console.log("Popup loaded successfully");

  document.getElementById("matchBtn").addEventListener("click", () => {
    console.log("Match button clicked");

    let fileInput = document.getElementById("resumeUpload");

    if (fileInput.files.length === 0) {
      console.log("No file selected");
      alert("Please upload your resume.");
      return;
    }

    let file = fileInput.files[0];
    console.log("File selected:", file.name);

    let reader = new FileReader();

    reader.onload = function (event) {
      let resumeText = event.target.result;
      console.log("Resume file read successfully");

      chrome.storage.local.set({ resumeData: resumeText }, () => {
        console.log("Resume stored in chrome.storage.local");
        injectContentScript();
      });
    };

    reader.readAsText(file);
  });

  chrome.storage.local.get("resumeData", (data) => {
    if (data.resumeData) {
      console.log("Found stored resume data");
      injectContentScript();
    } else {
      console.log("No stored resume data found");
    }
  });
});

function injectContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) {
      console.log("No active tab found.");
      return;
    }

    console.log("Checking if content script is loaded...");

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => typeof extractJobDescription !== "undefined",
      },
      (results) => {
        if (!results || !results[0].result) {
          console.log("Content script not found. Injecting manually...");
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              files: ["content.js"],
            },
            () => {
              console.log("Content script injected. Sending message...");
              sendJobDescriptionRequest(tabs[0].id);
            }
          );
        } else {
          console.log("Content script already loaded. Sending message...");
          sendJobDescriptionRequest(tabs[0].id);
        }
      }
    );
  });
}

function sendJobDescriptionRequest(tabId) {
  chrome.tabs.sendMessage(
    tabId,
    { action: "getJobDescription" },
    (response) => {
      if (!response || !response.jobDescription) {
        console.log("Failed to retrieve job description.");
        alert("Failed to extract job description. Please try again.");
        return;
      }

      console.log(
        "Job description retrieved successfully:",
        response.jobDescription
      );
      processResume(response.jobDescription);
    }
  );
}

function processResume(jobDescription) {
  chrome.storage.local.get("resumeData", (data) => {
    if (!data.resumeData) {
      console.log("Resume data missing after retrieval attempt.");
      alert("Resume data missing. Please re-upload.");
      return;
    }

    let matchResult = matchResumeWithJob(data.resumeData, jobDescription);
    console.log("Match result computed:", matchResult);

    document.getElementById(
      "result"
    ).innerText = `Match Score: ${matchResult.score}%`;

    if (matchResult.missingWords.length > 0) {
      document.getElementById(
        "missingKeywords"
      ).innerText = `Missing Keywords: ${matchResult.missingWords.join(", ")}`;
    } else {
      document.getElementById("missingKeywords").innerText =
        "Your resume is a perfect match!";
    }
  });
}
