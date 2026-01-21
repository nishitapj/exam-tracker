import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { fullSyllabus } from "./data.js";

// --- YOUR CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCYyXAEMh2dTI_JvNzxqlLUMVBbWnIO7ho",
  authDomain: "exam-tracker-23c1c.firebaseapp.com",
  projectId: "exam-tracker-23c1c",
  storageBucket: "exam-tracker-23c1c.firebasestorage.app",
  messagingSenderId: "285050323574",
  appId: "1:285050323574:web:76ede5dd9e824f30a0d557",
  measurementId: "G-NGL34V940J"
};

// --- INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const USER_ID = "my_exam_tracker"; // This ID stores all your progress

// --- ROUTER & LOGIC ---
const path = window.location.pathname;
// Check if we are on the dashboard (index.html or root /)
const isDashboard = path.endsWith("index.html") || path.endsWith("/") || path === ""; 
const urlParams = new URLSearchParams(window.location.search);
const currentSubject = urlParams.get("sub");

// --- MAIN INIT FUNCTION ---
async function init() {
    console.log("App Initializing...");
    
    // 1. Sync Static Data to Firebase (First run only)
    try {
        await syncSchema();
    } catch (error) {
        console.error("Database Error:", error);
        alert("Error connecting to database. Did you set Firestore Rules to 'Test Mode'?");
    }

    // 2. Decide which page to render
    if (currentSubject) {
        renderSubjectPage(currentSubject);
    } else {
        renderDashboard();
    }
}

// --- DATABASE SYNC ---
async function syncSchema() {
    const docRef = doc(db, "trackers", USER_ID);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
        console.log("Creating fresh database schema...");
        let schema = {};
        // Convert your data.js structure into a flat checklist for the DB
        for (const [subKey, subData] of Object.entries(fullSyllabus)) {
            subData.topics.forEach(topic => {
                schema[topic.id] = false; // Default: Not Done
            });
        }
        await setDoc(docRef, schema);
        location.reload(); // Reload to show the fresh data
    }
}

// --- DASHBOARD RENDERER (index.html) ---
async function renderDashboard() {
    const docRef = doc(db, "trackers", USER_ID);
    const snap = await getDoc(docRef);
    const progressMap = snap.exists() ? snap.data() : {};

    // 1. Update Mini Progress Bars
    for (const [subKey, subData] of Object.entries(fullSyllabus)) {
        const total = subData.topics.length;
        const done = subData.topics.filter(t => progressMap[t.id]).length;
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);
        
        const bar = document.getElementById(`prog-${subKey}`);
        // We use optional chaining (?.) in case the element isn't found
        if(bar) bar.style.width = `${percent}%`;
    }

    // 2. Render Today's Tasks
    const todayStr = new Date().toISOString().split('T')[0]; 
    const container = document.getElementById("today-tasks");
    if(container) {
        container.innerHTML = "";
        let hasTasks = false;

        for (const [subKey, subData] of Object.entries(fullSyllabus)) {
            subData.topics.forEach(topic => {
                // Show task if: It's due today/past due AND it's not checked off
                if ((topic.date <= todayStr) && !progressMap[topic.id]) {
                    hasTasks = true;
                    const div = document.createElement("div");
                    div.className = "daily-task";
                    div.innerHTML = `
                        <div>
                            <strong>[${subKey}]</strong> ${topic.title}
                            <div style="font-size:0.8rem; opacity:0.7">${topic.unit}</div>
                        </div>
                        <a href="subject.html?sub=${subKey}" style="color:var(--accent); font-weight:bold;">GO &rarr;</a>
                    `;
                    container.appendChild(div);
                }
            });
        }

        if (!hasTasks) {
            container.innerHTML = `<div class="daily-task" style="border-left-color:var(--success)">🎉 All caught up for today!</div>`;
        }
    }

    // 3. Countdown to First Exam (ML)
    const countdownEl = document.getElementById("countdown");
    if(countdownEl) {
        const mlDate = new Date("2026-01-28");
        const today = new Date();
        const diffTime = mlDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        countdownEl.innerText = `${diffDays} Days to ML Exam`;
    }
}

// --- SUBJECT PAGE RENDERER (subject.html) ---
async function renderSubjectPage(subKey) {
    const data = fullSyllabus[subKey];
    if (!data) return; 

    // Set Header Info
    const titleEl = document.getElementById("subject-title");
    if(titleEl) titleEl.innerText = data.title;
    
    const dateEl = document.getElementById("exam-date");
    if(dateEl) dateEl.innerText = `Exam Date: ${data.examDate} | Target: ${data.target}`;

    // Fetch Progress
    const docRef = doc(db, "trackers", USER_ID);
    const snap = await getDoc(docRef);
    const progressMap = snap.exists() ? snap.data() : {};

    // Render Topics grouped by Unit
    const container = document.getElementById("topics-container");
    if(container) {
        container.innerHTML = ""; // Clear loading text
        
        // Group topics by Unit
        const grouped = {};
        data.topics.forEach(t => {
            if(!grouped[t.unit]) grouped[t.unit] = [];
            grouped[t.unit].push(t);
        });

        for (const [unit, topics] of Object.entries(grouped)) {
            const groupDiv = document.createElement("div");
            groupDiv.className = "unit-group";
            groupDiv.innerHTML = `<div class="unit-title">${unit}</div>`;

            topics.forEach(topic => {
                const isDone = progressMap[topic.id];
                const item = document.createElement("div");
                item.className = "topic-item";
                item.innerHTML = `
                    <span class="${isDone ? 'strikethrough' : ''}">${topic.title}</span>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="${topic.id}" ${isDone ? 'checked' : ''}>
                    </div>
                `;
                
                // Add Click Listener
                const box = item.querySelector("input");
                box.addEventListener("change", (e) => toggleTopic(topic.id, e.target.checked));
                
                groupDiv.appendChild(item);
            });
            container.appendChild(groupDiv);
        }
    }

    updateBattery(data.topics, progressMap);
}

// --- USER ACTIONS ---
async function toggleTopic(topicId, isChecked) {
    const docRef = doc(db, "trackers", USER_ID);
    
    // Update Firebase
    await updateDoc(docRef, {
        [topicId]: isChecked
    });
    
    // UI Update (Optimistic - instant feedback)
    const checkbox = document.getElementById(topicId);
    if(checkbox) {
        const label = checkbox.parentElement.previousElementSibling;
        if(isChecked) label.classList.add("strikethrough");
        else label.classList.remove("strikethrough");
    }

    // Recalculate Battery
    const snap = await getDoc(docRef);
    const progressMap = snap.data();
    const subData = fullSyllabus[currentSubject];
    updateBattery(subData.topics, progressMap);
}

function updateBattery(topics, progressMap) {
    const total = topics.length;
    const done = topics.filter(t => progressMap[t.id]).length;
    const percent = Math.round((done / total) * 100);

    const fill = document.getElementById("battery-fill");
    const text = document.getElementById("battery-text");

    if(fill && text) {
        fill.style.width = `${percent}%`;
        text.innerText = `${percent}% Charged`;

        // Battery Colors
        if(percent < 30) fill.style.background = "#ef4444"; // Red
        else if(percent < 70) fill.style.background = "#eab308"; // Yellow
        else fill.style.background = "#22c55e"; // Green
    }
}

// Start the app
init();