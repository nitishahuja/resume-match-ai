import { OPENAI_PROMPT } from "./prompts.js";

export const analyzeWithAI = async (resumeText, jobDescription) => {
  if (!window.OPENAI_API_KEY) {
    console.error("❌ OpenAI API Key is missing!");
    alert("API Key is not set. Please configure it first.");
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${window.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        max_tokens: 1000,
        messages: [
          { role: "system", content: OPENAI_PROMPT },
          { role: "user", content: `Job Description: "${jobDescription}"` },
          { role: "user", content: `Resume: "${resumeText}"` },
        ],
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content.trim());
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    return null;
  }
};
