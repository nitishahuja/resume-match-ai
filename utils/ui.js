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

  // ✅ Update Resume Snippet Modifications (Using TextArea)
  const snippetsContainer = document.getElementById("resumeSnippets");
  if (analysis.optimized_resume && analysis.optimized_resume.length > 0) {
    snippetsContainer.value = analysis.optimized_resume
      .map(
        (snippet) =>
          `🔴 Original: ${snippet.original}\n🟢 Improved: ${snippet.improved}\n\n`
      )
      .join("");
  } else {
    snippetsContainer.value = "No resume modifications suggested.";
  }

  // ✅ Update Insights Section (Using TextArea)
  const insightsContainer = document.getElementById("resumeInsights");
  if (analysis.insights && analysis.insights.length > 0) {
    insightsContainer.value = analysis.insights
      .map((insight) => `💡 ${insight}`)
      .join("\n\n");
  } else {
    insightsContainer.value = "No insights available.";
  }
};
