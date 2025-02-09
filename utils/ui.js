export const displayResults = (analysis) => {
  console.log("🎯 Displaying Analysis Results:", analysis);

  // ✅ Update Match Score
  const matchScore = analysis.match_score;
  document.getElementById("matchScore").innerText = `${matchScore}%`;

  // ✅ Get Match Category and Recommendation
  const { category, emoji, cssClass } = getMatchRecommendation(matchScore);

  // ✅ Update Match Category with Icon
  const matchCategoryElement = document.getElementById("matchCategory");
  matchCategoryElement.innerHTML = `${emoji} <strong>${category}</strong>`;
  matchCategoryElement.className = `match-category ${cssClass}`;

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

/**
 * Function to determine match recommendation based on score
 */
function getMatchRecommendation(score) {
  if (score >= 90) {
    return {
      category: "Excellent Fit",
      emoji: "🔥",
      cssClass: "excellent",
    };
  } else if (score >= 75) {
    return {
      category: "Good Fit",
      emoji: "✅",
      cssClass: "good",
    };
  } else if (score >= 60) {
    return {
      category: "Moderate Fit",
      emoji: "⚠️",
      cssClass: "moderate",
    };
  } else {
    return {
      category: "Weak Fit",
      emoji: "❌",
      cssClass: "weak",
    };
  }
}
