// ==========================================
// BIDIRECTIONAL SCROLL FADE OBSERVER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const fadeSections = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class when element enters viewport (scrolling down or up)
                entry.target.classList.add('is-visible');
            } else {
                // Remove class when element leaves viewport so it can fade in again next time
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    fadeSections.forEach(section => {
        fadeObserver.observe(section);
    });
});

// 1. Mobile Menu Toggle Logic
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');

if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Close menu automatically when clicking a link on mobile
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
}

// 2. Glassy Header on Scroll Logic
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ==========================================
// LIVE MULTI-LANGUAGE TERMINAL SIMULATION
// ==========================================
const terminalData = [
    {
        lang: "HTML",
        file: "INDEX.HTML",
        lines: 8,
        progress: 45,
        code: `&lt;!-- THE IT CODE: Digital Transformation Engine --&gt;\n&lt;div class="brand-container"&gt;\n    &lt;h1&gt;THE IT CODE&lt;/h1&gt;\n    &lt;p class="tagline"&gt;INNOVATE. BUILD. SCALE.&lt;/p&gt;\n    &lt;span class="it-factor"&gt;HealthOS &amp; Founder Circle&lt;/span&gt;\n&lt;/div&gt;`
    },
    {
        lang: "CSS",
        file: "STYLES.CSS",
        lines: 9,
        progress: 52,
        code: `/* Minimalist Aesthetics & The "It" Factor */\n.the-it-code {\n    background-color: #000000;\n    color: #ffffff;\n    font-family: 'Century Gothic', sans-serif;\n    border-radius: 12px;\n    display: flex;\n    transform: scale(1.02);\n}`
    },
    {
        lang: "JS",
        file: "APP.JS",
        lines: 8,
        progress: 68,
        code: `// Powering Flagship Platforms\nconst theItCode = {\n    ceo: "Founder & CEO",\n    products: ["HealthOS™", "The Founder Circle™"],\n    executeWorkflow: function() {\n        return "Cracking the tech code for scale.";\n    }\n};`
    },
    {
        lang: "PYTHON",
        file: "ENGINE.PY",
        lines: 8,
        progress: 75,
        code: `# Automated Workflow & Intelligence\nclass TheITCodeEngine:\n    def __init__(self):\n        self.brand = "THE IT CODE"\n    def transform_workflow(self, data_feed):\n        return f"Re-engineering {data_feed} for high impact."`
    },
    {
        lang: "SQL",
        file: "DATABASE.SQL",
        lines: 10,
        progress: 63,
        code: `SELECT \n    solution,\n    innovation,\n    impact,\n    scalability\nFROM the_it_code_solutions\nWHERE engineered = 'true'\n  AND purpose = 'transform'\n  AND future_ready = 'yes'\nORDER BY impact DESC;`
    },
    {
        lang: "NODE.JS",
        file: "SERVER.JS",
        lines: 8,
        progress: 84,
        code: `// Server-side Ecosystem Core\nconst express = require('express');\nconst app = express();\n\napp.get('/api/healthos', (req, res) => {\n    res.status(200).json({ status: "Workflow Optimized" });\n});`
    },
    {
        lang: "REACT",
        file: "COMPONENT.JSX",
        lines: 8,
        progress: 91,
        code: `// Client Ecosystem Interface\nexport default function ITCodeApp() {\n    return (\n        &lt;div className="ecosystem-view"&gt;\n            &lt;HealthOSModule /&gt;\n            &lt;FounderCircleHub /&gt;\n        &lt;/div&gt;\n    );\n}`
    },
    {
        lang: "API",
        file: "ENDPOINT.JSON",
        lines: 8,
        progress: 100,
        code: `{\n    "enterprise": "THE IT CODE (Pty) Ltd",\n    "status": "Operational",\n    "headquarters": "Kuruman | Cape Town",\n    "mission": "Engineering digital transformation with purpose"\n}`
    }
];

let activeTerminalIndex = 4; // Start on SQL
const codeDisplay = document.getElementById('live-code-display');
const langLabel = document.getElementById('current-lang-label');
const fileLabel = document.getElementById('current-file-label');
const lineNumbersBox = document.getElementById('line-numbers-box');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressPercentage = document.getElementById('progress-percentage');
const tabButtons = document.querySelectorAll('.lang-tab-btn');

function renderTerminalSnippet(index) {
    if (!codeDisplay) return;

    // Fade out effect
    codeDisplay.classList.add('fade-out');

    setTimeout(() => {
        activeTerminalIndex = index;
        const currentData = terminalData[index];

        // Update labels
        if (langLabel) langLabel.textContent = currentData.lang;
        if (fileLabel) fileLabel.textContent = currentData.file;
        codeDisplay.innerHTML = currentData.code;

        // Update progress bar
        if (progressBarFill) progressBarFill.style.width = currentData.progress + '%';
        if (progressPercentage) progressPercentage.textContent = currentData.progress + '%';

        // Dynamically generate correct amount of line numbers
        if (lineNumbersBox) {
            let lineNumbersHTML = '';
            for (let i = 1; i <= currentData.lines; i++) {
                lineNumbersHTML += `<span>${i < 10 ? '0' + i : i}</span>`;
            }
            lineNumbersBox.innerHTML = lineNumbersHTML;
        }

        // Update active state on tab buttons
        tabButtons.forEach((btn, idx) => {
            if (idx === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Fade in effect
        codeDisplay.classList.remove('fade-out');
    }, 300);
}

// Attach click events to the language tabs below the terminal
tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const targetIndex = parseInt(btn.getAttribute('data-index'));
        renderTerminalSnippet(targetIndex);
    });
});

// Auto-rotate snippets every 5 seconds if user isn't actively clicking tabs
let terminalInterval = setInterval(() => {
    activeTerminalIndex = (activeTerminalIndex + 1) % terminalData.length;
    renderTerminalSnippet(activeTerminalIndex);
}, 5000);

// Initialize with SQL on load
renderTerminalSnippet(4);

// ==========================================
// CONTACT FORM AJAX SUBMISSION & REDIRECT
// ==========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = this;
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Redirect seamlessly to your custom thank you page
                window.location.href = 'thank-you.html';
            } else {
                alert('Oops! There was a problem submitting your form. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error. Please check your connection.');
        }
    });
}
