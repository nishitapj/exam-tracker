# 🤞 Domain Expansion: V Sem (Exam Tracker)

> *"Throughout heaven and earth, I alone am the honored one (at passing exams)."*

A gamified, **Jujutsu Kaisen-themed exam preparation tracker** built to manage the chaos of the 5th Semester. It features real-time progress tracking, note-taking, file uploads, and a "Battle Plan" schedule to ensure an S-Grade performance.

## 🚀 Features

* **Mission Control Dashboard:** Live countdowns to every exam and a "Subject of the Day" target system.
* **Battery Progress:** Visual progress bars that fill up (Green/Yellow/Red) as you complete topics.
* **Chapter Notebooks:**
    * Click the **`+`** button beside any chapter to add quick notes.
    * **File Support:** Upload screenshots, PDFs, or Docs for specific chapters.
* **LP Syllabus Vault:** Upload your official syllabus image once, and it stays saved in the browser.
* **Cheat Sheet Mode:** A dedicated "Last Minute Revision" section for high-yield formulas and diagrams.
* **Persistent Data:** Uses **Firebase Firestore** to save your progress and notes across devices.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Glassmorphism/Dark Mode), JavaScript (ES6 Modules).
* **Backend:** Firebase Firestore (Real-time Database).
* **Storage:** LocalStorage (for Syllabus caching) + Firestore (for Notes).
* **Deployment:** Vercel / GitHub Pages.

## 📂 Project Structure

This project uses a **Single File Architecture** (`index.html`) for ease of deployment and editing. All logic, styling, and data are encapsulated within one file to prevent CORS issues during local testing.

## ⚙️ Setup & Installation

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/your-username/domain-expansion-tracker.git](https://github.com/your-username/domain-expansion-tracker.git)
    cd domain-expansion-tracker
    ```

2.  **Configure Firebase**
    * Open `index.html`.
    * Scroll down to the `<script>` section.
    * Replace the `const firebaseConfig = { ... }` object with your own keys from the [Firebase Console](https://console.firebase.google.com/).

3.  **Run Locally**
    * Simply open `index.html` in your browser.
    * *Note:* For file uploads to work perfectly, it is recommended to use a live server (e.g., VS Code Live Server extension).

## 🚀 Deployment

This project is ready for **Vercel** or **Netlify**.

1.  Push the code to GitHub.
2.  Import the repo into Vercel.
3.  Hit **Deploy**.
4.  *Crucial:* Ensure your Firebase Firestore Security Rules are set to `allow read, write: if true;` (for test mode) or configured for your specific domain.

## 📖 How to Use

1.  **The Dashboard:** Shows your subjects (ML, SE, CN, CC, CV).
    * **Red Badge:** Exam is Today!
    * **Yellow Badge:** Exam is Tomorrow.
2.  **Tracking:** Click a subject card -> Check off topics as you study. Watch the battery fill up!
3.  **Adding Notes:** Click the **`+`** button beside a chapter title. You can type notes or attach a screenshot/PDF.
4.  **Syllabus (LP):** Inside a subject page, click the **"📜 LP Syllabus"** button top-right to upload/view your official syllabus copy.

## 🛡️ License

This project is for personal academic use. Feel free to fork it and expand your own domain!

---
*Built with panic and caffeine.* ☕
