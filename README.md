# **Resume Match AI**

## 🚀 Overview

Resume Match AI is a **Chrome extension** that helps job seekers analyze their resumes against job descriptions. It extracts key requirements from job postings and compares them with your resume, providing a **match score**, optimized resume points, and key insights to enhance your job applications.

---

## 🎯 Features

- **Job Description Extraction**: Automatically extracts job descriptions from LinkedIn, Indeed, and other job boards.
- **Resume Analysis**: Reads and processes your uploaded resume.
- **Match Score Calculation**: Provides a percentage match based on relevant skills and experience.
- **Keyword Insights**: Identifies missing and matched keywords to improve your resume.
- **Optimized Resume Points**: Provides AI-generated improvements to **enhance your resume bullet points**, formatted for impact and clarity.
- **Key Insights**: Suggests **high-level resume improvements**, such as business impact, leadership skills, and missing technical depth.
- **User-Input API Key**: Users can **enter and update** their API key directly via the extension UI.
- **Simple UI**: Easy-to-use interface with a clean design.

---

## 📂 Project Structure

```
resume-matcher-extension/
│── manifest.json      # Chrome extension configuration
│── background.js      # Handles extension lifecycle events
│── content.js         # Extracts job descriptions from web pages
│── popup.html         # UI for uploading resumes and viewing match results
│── popup.js           # Handles user interactions
│── styles.css         # Styling for the popup UI
│── libs/              # External libraries (PDF processing, AI models, etc.)
│    ├── pdf.min.js
│    ├── pdf.worker.min.js
│── utils/             # Utilities
│    │── utils.js      # Utility functions
│    │── ui.js         # Handles UI updates
│    ├── ai.js         # AI logic for resume matching
│    ├── prompts.js    # Stores AI prompts for analysis
│── assets/            # Icons and images
│    ├── icon.png
│── README.md          # Documentation
```

---

## 🛠️ Installation

1️⃣ **Clone the Repository**

```sh
git clone https://github.com/your-username/resume-matcher-extension.git
cd resume-matcher-extension
```

2️⃣ **Load the Extension in Chrome**

- Open **Google Chrome** and go to `chrome://extensions/`.
- Enable **Developer Mode** (toggle switch in the top right).
- Click **Load Unpacked** and select the `resume-matcher-extension/` folder.

3️⃣ **Set Up Your API Key**

- **Click the Extension Icon** to open the UI.
- **Enter your OpenAI API Key** in the provided input field.
- **Save the API Key** (You can update it anytime from the extension settings).

4️⃣ **Start Using**

- Visit a job posting website (LinkedIn, Indeed, etc.).
- Click the **Resume Match AI** extension icon.
- Upload your resume and get a match score!

---

## 🖥️ Usage

1️⃣ **Open a Job Description**: Navigate to a job posting.  
2️⃣ **Upload Your Resume**: Click the extension and select a `.txt` or `.pdf` resume.  
3️⃣ **View Results**:

- ✅ **Match Score** (how well your resume aligns with the job)
- ✅ **Matched & Missing Keywords**
- ✅ **Optimized Resume Snippets** (AI-enhanced resume bullet points)
- ✅ **Key Insights** (high-level recommendations for improvement)

---

## 🚀 Future Enhancements

- **Capability for Multiple Websites**: Extend support to extract job descriptions from additional job boards and company career pages.
- **Save and Track Matches**: Store match history for multiple job applications.

---

## 📜 License

This project is open-source under the **MIT License**.

---

## 🤝 Contributing

Contributions are welcome! Feel free to **fork** this repo and submit a pull request.

---

## 📬 Contact

For questions, reach out via [GitHub Issues](https://github.com/your-username/resume-matcher-extension/issues).

---

🚀 **Resume Match AI – Helping You Land Your Dream Job!**
