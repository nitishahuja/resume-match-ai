export const displayResults = (analysis) => {
  console.log("🎯 Displaying Analysis Results:", analysis);

  // ✅ Update Match Score
  document.getElementById(
    "matchScore"
  ).innerText = `Match Score: ${analysis.match_score}%`;

  // ✅ Update Matched Keywords
  const matchedList = document.getElementById("matchedKeywords");
  matchedList.innerHTML = analysis.matched_skills
    .map((skill) => `<li>${skill}</li>`)
    .join("");

  // ✅ Update Missing Keywords
  const missingList = document.getElementById("missingKeywords");
  missingList.innerHTML = analysis.missing_skills
    .map((skill) => `<li>${skill}</li>`)
    .join("");

  // ✅ Update Resume Snippet Improvements
  const snippetsContainer = document.getElementById("resumeSnippets");
  if (analysis.optimized_resume && analysis.optimized_resume.length > 0) {
    snippetsContainer.innerHTML = analysis.optimized_resume
      .map(
        (snippet) => `
        <div class="snippet">
          <p><strong>🔴 Original:</strong> ${snippet.original}</p>
          <p><strong>🟢 Improved:</strong> ${snippet.improved}</p>
        </div>`
      )
      .join("");
  } else {
    snippetsContainer.innerHTML = "<p>No resume modifications suggested.</p>";
  }

  // ✅ Update Insights Section
  const insightsList = document.getElementById("resumeInsights");
  if (analysis.insights && analysis.insights.length > 0) {
    insightsList.innerHTML = analysis.insights
      .map((insight) => `<li>${insight}</li>`)
      .join("");
  } else {
    insightsList.innerHTML = "<li>No insights available.</li>";
  }
};
