// Load compromise.js for NLP-based keyword extraction
function extractImportantKeywords(text) {
  console.log("🔍 Extracting important keywords...");

  // Convert text to lowercase and split into words
  let words = text.toLowerCase().split(/\W+/);

  // Define job-related keywords manually (can be expanded)
  const jobRelatedTerms = new Set([
    "javascript",
    "python",
    "react",
    "node",
    "angular",
    "aws",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "data analysis",
    "sql",
    "java",
    "frontend",
    "backend",
    "fullstack",
    "developer",
    "engineer",
    "designer",
    "software",
    "cloud",
    "microservices",
    "docker",
    "kubernetes",
    "html",
    "css",
    "typescript",
    "api",
    "security",
    "devops",
    "database",
    "networking",
  ]);

  // Define common stop words to ignore
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "but",
    "by",
    "for",
    "if",
    "in",
    "into",
    "is",
    "it",
    "of",
    "on",
    "or",
    "such",
    "that",
    "the",
    "their",
    "then",
    "there",
    "these",
    "they",
    "this",
    "to",
    "was",
    "will",
    "with",
    "your",
    "you",
    "from",
    "we",
    "our",
    "has",
    "have",
    "been",
    "were",
    "am",
    "which",
    "who",
    "whom",
    "whose",
    "where",
    "when",
    "why",
    "what",
    "how",
  ]);

  // Filter job description to keep only job-related terms
  let keywords = words.filter(
    (word) =>
      word.length > 2 && !stopWords.has(word) && jobRelatedTerms.has(word)
  );

  console.log("✅ Extracted Keywords:", keywords);
  return [...new Set(keywords)]; // Remove duplicates
}

// Match resume with job description using extracted keywords
function matchResumeWithJob(resumeText, jobDescription) {
  console.log("📝 Matching resume with job description...");

  let resumeWords = new Set(resumeText.toLowerCase().split(/\W+/));
  let jobKeywords = extractImportantKeywords(jobDescription); // Extract important words from job description

  let matchedWords = jobKeywords.filter((word) => resumeWords.has(word));
  let missingWords = jobKeywords.filter((word) => !resumeWords.has(word));

  let score = (matchedWords.length / jobKeywords.length) * 100;

  console.log(`✅ Match Score: ${Math.round(score)}%`);
  console.log("❌ Missing Keywords:", missingWords);

  return {
    score: Math.round(score),
    missingWords,
  };
}
