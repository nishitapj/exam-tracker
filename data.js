export const fullSyllabus = {
    "ML": {
        title: "Machine Learning",
        target: "58/60 (S Grade)", 
        examDate: "2026-01-28",
        examTime: "9:30 AM - 11:30 AM",
        topics: [
            { id: "ml_1", unit: "Unit 2", title: "Neural Networks & Backprop", date: "2026-01-21" },
            { id: "ml_2", unit: "Unit 2", title: "CNN Architectures (AlexNet)", date: "2026-01-21" },
            { id: "ml_3", unit: "Unit 1", title: "Regression Math (L1/L2)", date: "2026-01-21" },
            { id: "ml_4", unit: "Unit 3", title: "Ensemble Learning", date: "2026-01-22" },
            { id: "ml_5", unit: "Unit 1", title: "SVM & Kernels", date: "2026-01-23" },
            { id: "ml_6", unit: "Unit 2", title: "RNN vs LSTM", date: "2026-01-24" }
        ],
        revision: [
            "Derivation: Backpropagation Weight Update (Chain Rule)",
            "Formula: MSE Cost Function & Gradient Descent",
            "Formula: L1 (Lasso) vs L2 (Ridge) equations",
            "Diagram: AlexNet Architecture (Conv->Pool->FC)",
            "Concept: Vanishing Gradient (Why LSTM uses Gates)"
        ]
    },
    "SE": {
        title: "Software Engineering",
        target: "100/100 (S Grade)",
        examDate: "2026-01-30",
        examTime: "9:30 AM - 12:30 PM",
        topics: [
            { id: "se_1", unit: "Unit 3", title: "DevOps & Jenkins Arch", date: "2026-01-29" },
            { id: "se_2", unit: "Unit 1", title: "Agile Manifesto & Scrum", date: "2026-01-29" },
            { id: "se_3", unit: "Unit 2", title: "System Modeling", date: "2026-01-29" },
            { id: "se_4", unit: "Unit 2", title: "Testing & TDD", date: "2026-01-29" }
        ],
        revision: [
            "Diagram: Jenkins Master-Slave Architecture",
            "List: 4 Agile Values & 12 Principles (Memorize)",
            "Diagram: Use Case & Sequence Diagrams",
            "Concept: INVEST Model for User Stories",
            "Concept: TDD Cycle (Red-Green-Refactor)"
        ]
    },
    "CN": {
        title: "Computer Networks 2",
        target: "90/100 (A Grade)",
        examDate: "2026-02-02",
        examTime: "9:30 AM - 12:30 PM",
        topics: [
            { id: "cn_1", unit: "Unit 1", title: "Queuing Theory (M/M/1)", date: "2026-01-22" },
            { id: "cn_2", unit: "Unit 2", title: "Error Detection (CRC)", date: "2026-01-23" },
            { id: "cn_3", unit: "Unit 3", title: "Wireless (Mobile IP)", date: "2026-01-31" },
            { id: "cn_4", unit: "Unit 1", title: "Routing (OSPF/BGP)", date: "2026-02-01" }
        ],
        revision: [
            "Formula: Little's Law (L = λW)",
            "Math: CRC Division (Practice one problem)",
            "Diagram: OSPF Header Format",
            "Flowchart: CSMA/CD Operation",
            "Concept: Mobile IP (Home vs Foreign Agent)"
        ]
    },
    "CC": {
        title: "Cloud Computing",
        target: "59/60 (A Grade)",
        examDate: "2026-02-05",
        examTime: "9:30 AM - 11:30 AM",
        topics: [
            { id: "cc_1", unit: "Unit 1", title: "K8s Architecture", date: "2026-02-03" },
            { id: "cc_2", unit: "Unit 2", title: "Microservices", date: "2026-02-04" },
            { id: "cc_3", unit: "Unit 1", title: "Docker & Virt", date: "2026-02-03" }
        ],
        revision: [
            "Diagram: Kubernetes Cluster (Control Plane vs Nodes)",
            "Code: Dockerfile Commands (FROM, RUN, CMD)",
            "Diagram: Leaf-Spine Network Topology",
            "Concept: Microservices vs Monolith",
            "Tool: Ansible Playbook Structure (YAML)"
        ]
    },
    "CV": {
        title: "Computer Vision",
        target: "96/100 (S Grade)",
        examDate: "2026-02-06",
        examTime: "9:30 AM - 12:30 PM",
        topics: [
            { id: "cv_1", unit: "Unit 1", title: "Filters & Edge", date: "2026-02-05" },
            { id: "cv_2", unit: "Unit 1", title: "SIFT & Features", date: "2026-02-05" },
            { id: "cv_3", unit: "Unit 2", title: "Optical Flow", date: "2026-02-05" }
        ],
        revision: [
            "Equation: 2D Gaussian Kernel",
            "Steps: Canny Edge Detection Algorithm",
            "Equation: Optical Flow (Brightness Constancy)",
            "Concept: SIFT Keypoint Localization",
            "Math: RANSAC Loop Logic"
        ]
    }
};