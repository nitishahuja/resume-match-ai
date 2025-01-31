export const displayResults = (analysis) => {
  console.log("🎯 Displaying Analysis Results:", analysis);

  // ✅ Update match score
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

  // ✅ Update Resume Improvements (NEW)
  const improvementsContainer = document.getElementById("updatedResume");
  if (analysis.improvements && analysis.improvements.length > 0) {
    improvementsContainer.value = analysis.improvements
      .map((improvement, index) => `• ${improvement}`)
      .join("\n\n"); // Adds bullet points and spacing
  } else {
    improvementsContainer.value = "No additional improvements suggested.";
  }
};
