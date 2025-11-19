const API = window.location.origin;

// DOM helper
function showOutput(html, className) {
    const out = document.getElementById("output");
    out.innerHTML = html;
    out.className = "result " + className + " fadeIn";
    out.style.display = "block";
    out.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* --------------------------
    History (Encrypted Storage)
---------------------------*/
const KEY = "breach_history_v2";
const ENCRYPT_KEY = "breach_secure_key_2024"; // Simple obfuscation

// Simple XOR encryption for basic obfuscation
function simpleEncrypt(text) {
    return btoa(text.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ ENCRYPT_KEY.charCodeAt(i % ENCRYPT_KEY.length))
    ).join(''));
}

function simpleDecrypt(encoded) {
    try {
        return atob(encoded).split('').map((char, i) => 
            String.fromCharCode(char.charCodeAt(0) ^ ENCRYPT_KEY.charCodeAt(i % ENCRYPT_KEY.length))
        ).join('');
    } catch (e) {
        return '[]';
    }
}

function loadHistory() {
    try {
        const encrypted = localStorage.getItem(KEY);
        if (!encrypted) return [];
        const decrypted = simpleDecrypt(encrypted);
        return JSON.parse(decrypted);
    } catch (e) {
        console.error("History load error:", e);
        return [];
    }
}

function saveHistory(arr) {
    try {
        const json = JSON.stringify(arr);
        const encrypted = simpleEncrypt(json);
        localStorage.setItem(KEY, encrypted);
    } catch (e) {
        console.error("History save error:", e);
    }
}

function addToHistory(entry) {
    const h = loadHistory();
    h.unshift(entry);
    if (h.length > 100) h.pop();
    saveHistory(h);
}

function renderHistory() {
    const list = document.getElementById("historyList");
    const arr = loadHistory();
    if (arr.length === 0) {
        list.innerHTML = "<div class='empty'>No history yet. Start checking emails and passwords!</div>";
        return;
    }
    list.innerHTML = arr.map(item => `
        <div class="hist-item fadeIn">
            <div>
                <strong>${escapeHtml(item.query)}</strong>
                <div class="hist-meta">${item.type} • ${new Date(item.date).toLocaleString()}</div>
            </div>
            <div style="font-size: 20px;">${item.result.breached ? "⚠️" : "✅"}</div>
        </div>
    `).join("");
}

// Prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/* --------------------------
    Export History (JSON/CSV)
---------------------------*/
function exportHistory() {
    const history = loadHistory();
    if (history.length === 0) {
        alert("No history to export!");
        return;
    }

    // Ask user for format
    const format = prompt("Export format?\nType 'json' or 'csv'", "json");
    
    if (format === 'json') {
        exportJSON(history);
    } else if (format === 'csv') {
        exportCSV(history);
    } else {
        alert("Invalid format. Please type 'json' or 'csv'");
    }
}

function exportJSON(history) {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    downloadFile(blob, 'breach-history.json');
}

function exportCSV(history) {
    let csv = 'Type,Query,Date,Breached,Details\n';
    history.forEach(item => {
        const breached = item.result.breached ? 'Yes' : 'No';
        const details = item.result.breached ? 
            (item.result.count || item.result.data?.length || 'Unknown') : 'Clean';
        csv += `${item.type},"${item.query}","${item.date}",${breached},"${details}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, 'breach-history.csv');
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/* --------------------------
    Random Password Generator
---------------------------*/
function generatePassword() {
    const length = 16;
    const chars = {
        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lower: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()-_=+[]{};:,.<>/?"
    };

    let password = "";
    password += chars.upper[Math.floor(Math.random() * chars.upper.length)];
    password += chars.lower[Math.floor(Math.random() * chars.lower.length)];
    password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    password += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];

    const all = chars.upper + chars.lower + chars.numbers + chars.symbols;

    while (password.length < length) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    return password.split("").sort(() => Math.random() - 0.5).join("");
}

/* --------------------------
    Email Checker (BD)
---------------------------*/
async function checkBDEmail() {
    const email = document.getElementById("email").value.trim();

    if (!email) {
        showOutput(`<div class="result-title">⚠️ Input Required</div><div>Please enter an email address.</div>`, "result-info");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showOutput(`<div class="result-title">⚠️ Invalid Email</div><div>Please enter a valid email address.</div>`, "result-info");
        return;
    }

    // Demo breach email
    if (email.toLowerCase() === "demo-breach@example.com") {
        showOutput(`
            <div class="result-title">⚠️ Demo Email Breached</div>
            <ul style="padding-left:18px; margin: 10px 0;">
                <li>LinkedIn Data Leak</li>
                <li>Dropbox Breach</li>
                <li>MyFitnessPal Breach</li>
            </ul>
            <strong>This is a demonstration breach result.</strong>
            <br><br>
            <button onclick="window.location.href='https://accounts.google.com/signin/v2/recoveryidentifier'" 
                class="btn-primary fadeIn">
                🔐 Reset Password on Google
            </button>
        `, "result-breach");
        return;
    }

    showOutput(`<div class="loading">🔍 Checking email for breaches...</div>`, "result-info");

    try {
        const res = await fetch(API + "/check-email-bd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        addToHistory({
            type: "email",
            query: email,
            date: new Date().toISOString(),
            result: data
        });

        if (data.error) {
            showOutput(`<div class="result-title">❌ Error</div><div>${escapeHtml(data.error)}</div>`, "result-info");
            return;
        }

        if (data.breached && data.data.length > 0) {
            const breaches = data.data.map(b => `<li>${escapeHtml(b)}</li>`).join("");

            showOutput(`
                <div class="result-title">⚠️ Email Found in ${data.data.length} Breach(es)</div>
                <ul style="padding-left:18px; margin: 10px 0;">${breaches}</ul>
                <div><strong>Recommended Actions:</strong></div>
                <ul style="padding-left:18px; margin: 10px 0;">
                    <li>Reset your account password immediately</li>
                    <li>Enable 2-Factor Authentication</li>
                    <li>Avoid reusing passwords across sites</li>
                </ul>
                <button onclick="window.location.href='https://accounts.google.com/signin/v2/recoveryidentifier'" 
                    class="btn-primary fadeIn" style="margin-top: 12px;">
                    🔐 Reset Password on Google
                </button>
            `, "result-breach");

        } else {
            showOutput(`
                <div class="result-title">✅ Good News!</div>
                <div>This email was not found in known breaches.</div>
            `, "result-safe");
        }

    } catch (err) {
        showOutput(`<div class='result-title'>❌ Connection Error</div><div>${escapeHtml(err.message)}</div>`, "result-info");
    }
}

/* --------------------------
    Password Checker (HIBP)
---------------------------*/
async function checkPassword() {
    const password = document.getElementById("password").value;

    if (!password) {
        showOutput(`<div class="result-title">⚠️ Input Required</div><div>Please enter a password.</div>`, "result-info");
        return;
    }

    if (password.length < 4) {
        showOutput(`<div class="result-title">⚠️ Too Short</div><div>Enter at least 4 characters.</div>`, "result-info");
        return;
    }

    showOutput(`<div class="loading">🔍 Checking password securely...</div>`, "result-info");

    try {
        const res = await fetch(API + "/check-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        // Store masked password in history
        addToHistory({
            type: "password",
            query: "*".repeat(password.length) + ` (${password.length} chars)`,
            date: new Date().toISOString(),
            result: data
        });

        if (data.error) {
            showOutput(`<div class="result-title">❌ Error</div><div>${escapeHtml(data.error)}</div>`, "result-info");
            return;
        }

        if (data.breached && data.count > 0) {
            showOutput(`
                <div class="result-title">🚨 Password Compromised!</div>
                <div>This password has appeared <strong>${data.count.toLocaleString()}</strong> times in data breaches.</div>
                <br>
                <button onclick="window.location.href='password-generator.html'" class="btn-primary fadeIn">
                    🔑 Create a Strong Password
                </button>
            `, "result-breach");

        } else {
            showOutput(`
                <div class="result-title">✅ Password Safe!</div>
                <div>No breach found for this password.</div>
            `, "result-safe");
        }

    } catch (err) {
        showOutput(`<div class="result-title">❌ Connection Error</div><div>${escapeHtml(err.message)}</div>`, "result-info");
    }
}

/* --------------------------
    Dark Mode
---------------------------*/
const THEME_KEY = "theme_mode";

function setTheme(mode) {
    if (mode === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }

    localStorage.setItem(THEME_KEY, mode);

    const btn = document.getElementById("themeToggle");
    if (btn) {
        btn.textContent = mode === "dark" ? "☀️" : "🌙";
        btn.title = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";
    }
}

/* --------------------------
    Event Listeners
---------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    // Check buttons
    document.getElementById("checkEmailBtn").onclick = checkBDEmail;
    document.getElementById("checkPasswordBtn").onclick = checkPassword;

    // Password generator
    const genBtn = document.getElementById("generatePasswordBtn");
    const genOut = document.getElementById("generatedPassword");
    const copyBtn = document.getElementById("copyPasswordBtn");

    if (genBtn) {
        genBtn.onclick = () => {
            const pwd = generatePassword();
            genOut.textContent = pwd;
            document.getElementById("password").value = pwd;
        };
    }

    if (copyBtn) {
        copyBtn.onclick = () => {
            const pwd = genOut.textContent;
            if (pwd.length > 0) {
                navigator.clipboard.writeText(pwd).then(() => {
                    const original = copyBtn.textContent;
                    copyBtn.textContent = "✓";
                    setTimeout(() => {
                        copyBtn.textContent = original;
                    }, 2000);
                });
            }
        };
    }

    // History modal
    document.getElementById("historyBtn").onclick = () => {
        document.getElementById("historyModal").style.display = "flex";
        renderHistory();
    };

    document.getElementById("closeHistory").onclick = () => {
        document.getElementById("historyModal").style.display = "none";
    };

    document.getElementById("clearHistory").onclick = () => {
        if (confirm("Are you sure you want to clear all history?")) {
            localStorage.removeItem(KEY);
            renderHistory();
        }
    };

    document.getElementById("exportHistory").onclick = exportHistory;

    // Theme toggle
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    setTheme(savedTheme);

    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const current = localStorage.getItem(THEME_KEY) || "light";
            const next = current === "dark" ? "light" : "dark";
            setTheme(next);
        });
    }

    // Close modal on outside click
    document.getElementById("historyModal").addEventListener("click", (e) => {
        if (e.target.id === "historyModal") {
            document.getElementById("historyModal").style.display = "none";
        }
    });
});