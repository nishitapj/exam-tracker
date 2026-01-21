import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- CONFIGURATION (REPLACE WITH YOUR KEYS) ---
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
const TASKS_COLLECTION = "exam_tasks";

// --- YOUR CUSTOM WORKFLOW DATA ---
const initialWorkflow = [
    // TODAY
    { id: "1", date: "Jan 21 (Today - 5PM)", subject: "ML", title: "Unit 2: Neural Networks", desc: "Derive Backpropagation. Memorize CNN layers (AlexNet).", done: false },
    { id: "2", date: "Jan 21 (Today - Night)", subject: "ML", title: "Unit 1: Regression Math", desc: "Formulas for MSE, Lasso (L1) vs Ridge (L2).", done: false },
    
    // TOMORROW
    { id: "3", date: "Jan 22 (Thu)", subject: "ML", title: "Unit 3: Ensembles", desc: "Bagging vs Boosting. Random Forest concepts.", done: false },
    { id: "4", date: "Jan 22 (Thu)", subject: "CN", title: "Unit 1: Queuing Theory", desc: "Study M/M/1 Formulas. Solve 2 problems.", done: false, priority: "High" },
    
    // FRIDAY (The "Danger" Day)
    { id: "5", date: "Jan 23 (Fri)", subject: "CN", title: "Unit 2: Math & Protocols", desc: "Practice CRC Division. Memorize CSMA/CD Flowchart.", done: false },
    { id: "6", date: "Jan 23 (Fri)", subject: "ML", title: "Unit 1: SVM & Kernels", desc: "Geometric interpretation of Support Vectors.", done: false },
    
    // WEEKEND (Focus on ML Exam)
    { id: "7", date: "Jan 24 (Sat)", subject: "ML", title: "Full Syllabus Revision", desc: "Solve 1 previous year paper.", done: false },
    { id: "8", date: "Jan 25 (Sun)", subject: "ML", title: "Cheat Sheet Creation", desc: "Write down all formulas on 1 sheet.", done: false },
    
    // EXAM WEEK
    { id: "9", date: "Jan 28 (Wed - PM)", subject: "SE", title: "Unit 1: Agile", desc: "Agile Manifesto, Scrum vs XP. (Post ML Exam)", done: false },
    { id: "10", date: "Jan 29 (Thu)", subject: "SE", title: "Unit 3: DevOps", desc: "Jenkins Architecture diagram. CI vs CD.", done: false },
    { id: "11", date: "Jan 30 (Fri - PM)", subject: "CN", title: "Unit 3: Wireless", desc: "Mobile IP, Bluetooth. (Post SE Exam)", done: false },
    { id: "12", date: "Feb 1 (Sun)", subject: "CN", title: "Unit 1: Routing", desc: "OSPF Headers, Dijkstra Algo steps.", done: false },
    
    // GAP DAYS
    { id: "13", date: "Feb 3 (Tue)", subject: "CC", title: "Unit 1: K8s & Docker", desc: "K8s Architecture, Dockerfile commands.", done: false },
    { id: "14", date: "Feb 4 (Wed)", subject: "CC", title: "Unit 2: Microservices", desc: "Service Mesh, Serverless (Lambda).", done: false },
    { id: "15", date: "Feb 5 (Thu - PM)", subject: "CV", title: "Unit 1: Filters", desc: "Gaussian Kernel math, Canny Edge steps.", done: false }
];

// --- APP LOGIC ---

async function initApp() {
    const listEl = document.getElementById('task-list');
    
    // 1. Check if tasks exist, if not, seed them
    const snapshot = await getDocs(collection(db, TASKS_COLLECTION));
    if (snapshot.empty) {
        console.log("Seeding database...");
        const batch = writeBatch(db);
        initialWorkflow.forEach(task => {
            const docRef = doc(db, TASKS_COLLECTION, task.id);
            batch.set(docRef, task);
        });
        await batch.commit();
        location.reload(); // Reload to fetch newly seeded data
        return;
    }

    // 2. Render Tasks
    const tasks = [];
    snapshot.forEach(doc => tasks.push(doc.data()));
    
    // Sort by ID (simple chronological sort since IDs are 1, 2, 3...)
    tasks.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    renderTasks(tasks);
    updateProgress(tasks);
}

function renderTasks(tasks) {
    const container = document.getElementById('task-list');
    container.innerHTML = '';
    
    let currentDate = '';
    
    tasks.forEach(task => {
        // Create date header if new date
        if (task.date !== currentDate) {
            const dateHeader = document.createElement('div');
            dateHeader.className = 'date-header';
            dateHeader.textContent = task.date;
            container.appendChild(dateHeader);
            currentDate = task.date;
        }

        const item = document.createElement('div');
        item.className = `task-item ${task.done ? 'completed' : ''}`;
        item.innerHTML = `
            <div class="task-content">
                <span class="task-title">
                    ${task.title} 
                    <span class="task-badge" style="background:${getSubjectColor(task.subject)}">${task.subject}</span>
                </span>
                <span class="task-desc">${task.desc}</span>
            </div>
            <input type="checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}">
        `;
        
        // Add click listener to checkbox
        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', (e) => toggleTask(task.id, e.target.checked));
        
        container.appendChild(item);
    });
}

async function toggleTask(id, isDone) {
    const docRef = doc(db, TASKS_COLLECTION, id);
    await updateDoc(docRef, { done: isDone });
    
    // Optimistic UI update (optional, but recalculate progress)
    const snapshot = await getDocs(collection(db, TASKS_COLLECTION));
    const tasks = [];
    snapshot.forEach(doc => tasks.push(doc.data()));
    updateProgress(tasks);
    
    // Re-render to update strikethrough styling
    // (In a real React app this would be automatic, here we cheat)
    const item = document.querySelector(`input[data-id="${id}"]`).closest('.task-item');
    if(isDone) item.classList.add('completed');
    else item.classList.remove('completed');
}

function updateProgress(tasks) {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const percent = Math.round((done / total) * 100);
    
    document.getElementById('progress-text').textContent = `${percent}%`;
    document.getElementById('progress-fill').style.width = `${percent}%`;
}

function getSubjectColor(subject) {
    const colors = {
        'ML': '#4CAF50',
        'SE': '#2196F3',
        'CN': '#f44336',
        'CC': '#FF9800',
        'CV': '#9C27B0'
    };
    return colors[subject] || '#666';
}

initApp();