# Resume Match AI

## 🚀 Overview

Resume Match AI is a **Chrome extension** that helps job seekers analyze their resumes against job descriptions. It extracts key requirements from job postings and compares them with your resume, providing a **match score** and highlighting missing keywords and relevant skills.

## 🎯 Features

- **Job Description Extraction**: Automatically extracts job descriptions from LinkedIn, Indeed, and other job boards.
- **Resume Analysis**: Reads and processes your uploaded resume.
- **Match Score Calculation**: Provides a percentage match based on relevant skills and experience.
- **Keyword Insights**: Identifies missing and matched keywords to improve your resume.
- **Simple UI**: Easy-to-use interface with a clean design.

## 📂 Project Structure

```
resume-match-ai/
│── manifest.json      # Chrome extension configuration
│── background.js      # Handles extension lifecycle events
│── content.js         # Extracts job descriptions from web pages
│── popup.html         # UI for uploading resumes and viewing match results
│── popup.js           # Handles user interactions
│── styles.css         # Styling for the popup UI
│── matcher.js         # Compares resume with job description
│── assets/            # Icons and images
```

## 🛠️ Installation

1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/resume-match-ai.git
   cd resume-match-ai
   ```
2. **Load the Extension in Chrome**
   - Open **Google Chrome** and go to `chrome://extensions/`.
   - Enable **Developer Mode** (toggle switch in the top right).
   - Click **Load Unpacked** and select the `resume-match-ai/` folder.
3. **Start Using**
   - Visit a job posting website (LinkedIn, Indeed, etc.).
   - Click the **Resume Match AI** extension icon.
   - Upload your resume and get a match score!

## 🖥️ Usage

1. **Open a Job Description**: Navigate to a job posting.
2. **Upload Your Resume**: Click the extension and select a `.txt` or `.pdf` resume.
3. **View Results**: The extension will analyze the job description and compare it with your resume, providing a match score and missing keywords.

## 🚀 Future Enhancements

- **AI-Powered Resume Suggestions**: Recommend changes for better job matches.
- **PDF Parsing**: Extract text from PDF resumes automatically.
- **Industry-Specific Keyword Suggestions**: Improve keyword analysis based on job sector.
- **Save and Track Matches**: Store match history for multiple job applications.

## 📜 License

This project is open-source under the **MIT License**.

## 🤝 Contributing

Contributions are welcome! Feel free to **fork** this repo and submit a pull request.

## 📬 Contact

For questions, reach out via [GitHub Issues](https://github.com/your-username/resume-match-ai/issues).

---

🚀 **Resume Match AI – Helping You Land Your Dream Job!**
