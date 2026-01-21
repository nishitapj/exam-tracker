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

// --- INIT FIREBASE ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const USER_ID = "my_exam_tracker"; 

// --- ROUTER ---
const path = window.location.pathname;
const urlParams = new URLSearchParams(window.location.search);
const currentSubject = urlParams.get("sub");

// --- MAIN INIT ---
async function init() {
    console.log("App Initializing...");
    
    // 1. Sync Static Data (First run only)
    try {
        await syncSchema();
    } catch (error) {
        console.error("Database Error:", error);
    }

    // 2. Route Handling
    if (path.endsWith("revision.html")) {
        renderRevision();
    } 
    else if (currentSubject) {
        renderSubjectPage(currentSubject);
    } 
    else {
        // Default to dashboard
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
        for (const [subKey, subData] of Object.entries(fullSyllabus)) {
            subData.topics.forEach(topic => {
                schema[topic.id] = false; 
            });
        }
        await setDoc(docRef, schema);
        location.reload(); 
    }
}

// --- DASHBOARD RENDERER ---
async function renderDashboard() {
    console.log("Rendering Dashboard...");
    const docRef = doc(db, "trackers", USER_ID);
    const snap = await getDoc(docRef);
    const progressMap = snap.exists() ? snap.data() : {};
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Inject Revision Link
    const header = document.querySelector(".dashboard-header");
    if(header && !document.getElementById('rev-link')) {
        const link = document.createElement("a");
        link.id = 'rev-link';
        link.href = "revision.html";
        link.className = "daily-task"; 
        link.style.marginTop = "20px";
        link.style.background = "#1e293b";
        link.style.borderLeft = "4px solid #eab308";
        link.innerHTML = "<strong>⚡ Last Minute Revision / Cheat Sheets</strong><span style='font-size:1.2rem'>&rarr;</span>";
        header.appendChild(link);
    }

    // 2. Build Subject Grid
    const grid = document.querySelector('.subject-grid');
    if (grid) {
        grid.innerHTML = ""; // Clear existing
        
        let nearestObj = { name: "", days: 999, title: "" };

        for (const [subKey, subData] of Object.entries(fullSyllabus)) {
            // Days Left
            const examDate = new Date(subData.examDate);
            const diffTime = examDate - today;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Progress
            const total = subData.topics.length;
            const done = subData.topics.filter(t => progressMap[t.id]).length;
            const percent = total === 0 ? 0 : Math.round((done / total) * 100);

            // Track Nearest
            if (daysLeft >= 0 && daysLeft < nearestObj.days) {
                nearestObj = { name: subKey, days: daysLeft, title: subData.title };
            }

            // Colors
            let badgeColor = "#334155"; 
            let badgeText = `${daysLeft} Days Left`;
            if (daysLeft === 0) { badgeColor = "#ef4444"; badgeText = "TODAY!"; }
            else if (daysLeft === 1) { badgeColor = "#eab308"; badgeText = "TOMORROW!"; }
            else if (daysLeft < 0) { badgeText = "COMPLETED"; badgeColor = "#22c55e"; }

            const card = document.createElement("a");
            card.href = `subject.html?sub=${subKey}`;
            card.className = "subject-card";
            card.innerHTML = `
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="subject-code">${subKey}</span>
                        <span style="font-size:0.75rem; opacity:0.8">${subData.target}</span>
                    </div>
                    <div class="exam-meta">
                        <div>📅 ${subData.examDate}</div>
                        <div class="exam-time-row"><span>⏰ ${subData.examTime}</span></div>
                    </div>
                </div>
                <div>
                    <div class="countdown-badge" style="background:${badgeColor}">${badgeText}</div>
                    <div class="mini-progress">
                        <div class="mini-fill" style="width:${percent}%; background-color: ${percent === 100 ? '#22c55e' : ''}"></div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        }

        // 3. Update Main Banner
        const countdownEl = document.getElementById("countdown");
        if (countdownEl && nearestObj.title) {
            countdownEl.innerText = nearestObj.days === 0 
                ? `🚨 EXAM DAY: ${nearestObj.title}!` 
                : `🔥 Next Up: ${nearestObj.name} in ${nearestObj.days} Days`;
            if(nearestObj.days === 0) countdownEl.style.background = "#ef4444";
        }
    }

    // 4. Render Today's Tasks
    const container = document.getElementById("today-tasks");
    if(container) {
        container.innerHTML = "";
        const todayStr = new Date().toISOString().split('T')[0];
        let hasTasks = false;

        for (const [subKey, subData] of Object.entries(fullSyllabus)) {
            subData.topics.forEach(topic => {
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
            container.innerHTML = `<div class="daily-task" style="border-left-color:var(--success)">🎉 No pending tasks! Check Revision.</div>`;
        }
    }
}

// --- SUBJECT PAGE RENDERER ---
async function renderSubjectPage(subKey) {
    const data = fullSyllabus[subKey];
    if (!data) return; 

    const titleEl = document.getElementById("subject-title");
    if(titleEl) titleEl.innerText = data.title;
    
    const dateEl = document.getElementById("exam-date");
    if(dateEl) dateEl.innerText = `Exam: ${data.examDate} | ${data.examTime}`;

    const docRef = doc(db, "trackers", USER_ID);
    const snap = await getDoc(docRef);
    const progressMap = snap.exists() ? snap.data() : {};

    const container = document.getElementById("topics-container");
    if(container) {
        container.innerHTML = ""; 
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
                const box = item.querySelector("input");
                box.addEventListener("change", (e) => toggleTopic(topic.id, e.target.checked));
                groupDiv.appendChild(item);
            });
            container.appendChild(groupDiv);
        }
    }
    updateBattery(data.topics, progressMap);
}

// --- REVISION PAGE RENDERER ---
function renderRevision() {
    const container = document.getElementById("revision-grid");
    if (!container) return;

    for (const [subKey, subData] of Object.entries(fullSyllabus)) {
        const card = document.createElement("div");
        card.className = "rev-card";
        let listHTML = "";
        subData.revision.forEach(item => {
            listHTML += `<div class="rev-item">• ${item}</div>`;
        });

        card.innerHTML = `
            <div class="rev-header" onclick="this.nextElementSibling.classList.toggle('open')">
                <strong>${subKey} Cheat Sheet</strong>
                <span>▼</span>
            </div>
            <div class="rev-content">${listHTML}</div>
        `;
        container.appendChild(card);
    }
}

// --- ACTIONS ---
async function toggleTopic(topicId, isChecked) {
    const docRef = doc(db, "trackers", USER_ID);
    await updateDoc(docRef, { [topicId]: isChecked });
    
    // UI Update
    const checkbox = document.getElementById(topicId);
    if(checkbox) {
        const label = checkbox.parentElement.previousElementSibling;
        if(isChecked) label.classList.add("strikethrough");
        else label.classList.remove("strikethrough");
    }

    // Refresh Battery
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
        if(percent < 30) fill.style.background = "#ef4444"; 
        else if(percent < 70) fill.style.background = "#eab308"; 
        else fill.style.background = "#22c55e"; 
    }
}

init();