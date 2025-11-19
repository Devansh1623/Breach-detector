const API = window.location.origin;

// DOM helper
function showOutput(html, className){
    const out = document.getElementById("output");
    out.innerHTML = html;
    out.className = "result " + className + " fadeIn";
    out.style.display = "block";
    out.scrollIntoView({ behavior:"smooth" });
}

/* --------------------------
    History (Frontend only)
---------------------------*/
const KEY = "breach_history_v1";

function loadHistory(){
    return JSON.parse(localStorage.getItem(KEY) || "[]");
}
function saveHistory(arr){
    localStorage.setItem(KEY, JSON.stringify(arr));
}
function addToHistory(entry){
    const h = loadHistory();
    h.unshift(entry);
    if(h.length > 100) h.pop();
    saveHistory(h);
    renderHistory();
}

function renderHistory(){
    const list = document.getElementById("historyList");
    const arr = loadHistory();
    if(arr.length === 0){
        list.innerHTML = "<div class='empty'>No history yet.</div>";
        return;
    }
    list.innerHTML = arr.map(item => `
        <div class="hist-item fadeIn">
            <div>
                <strong>${item.query}</strong>
                <div class="hist-meta">${item.type} • ${new Date(item.date).toLocaleString()}</div>
            </div>
            <div>${item.result.breached ? "⚠️" : "✅"}</div>
        </div>
    `).join("");
}

/* --------------------------
    Email Checker (BD)
---------------------------*/
async function checkBDEmail(){
    const email = document.getElementById("email").value.trim();

    if(!email){
        showOutput(`<div class="result-title">⚠️ Input Required</div><div>Please enter an email address.</div>`, "result-info");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        showOutput(`<div class="result-title">⚠️ Invalid Email</div><div>Please enter a valid email address.</div>`, "result-info");
        return;
    }

    showOutput(`<div class="loading">🔍 Checking email for breaches...</div>`, "result-info");

    try{
        const res = await fetch(API + "/check-email-bd", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email})
        });

        const data = await res.json();

        addToHistory({
            type:"email",
            query:email,
            date:new Date().toISOString(),
            result:data
        });

        if(data.error){
            showOutput(`<div class="result-title">❌ Error</div><div>${data.error}</div>`, "result-info");
            return;
        }

        // EMAIL FOUND IN BREACH
        if(data.breached && data.data.length > 0){
            const breaches = data.data.map(b => `<li>${b}</li>`).join("");

            showOutput(`
                <div class="result-title">⚠️ Email Found in ${data.data.length} Breach(es)</div>
                <ul style="padding-left:18px;">${breaches}</ul>
                <br>
                <div><strong>Recommended Actions:</strong></div>
                <ul style="padding-left:18px;">
                    <li>Reset your account password immediately</li>
                    <li>Enable 2-Factor Authentication</li>
                    <li>Avoid reusing passwords across sites</li>
                </ul>
                <br>
                <button onclick="window.location.href='https://accounts.google.com/signin/v2/recoveryidentifier'" 
                    class="btn-primary fadeIn">
                    🔐 Reset Password on Google
                </button>
            `, "result-breach");

        } else {
            showOutput(`
                <div class="result-title">✅ Good News!</div>
                <div>This email was not found in known breaches.</div>
            `, "result-safe");
        }

    }catch(err){
        showOutput(`<div class='result-title'>❌ Connection Error</div><div>${err.message}</div>`, "result-info");
    }
}

/* --------------------------
    Password Checker (HIBP)
---------------------------*/
async function checkPassword(){
    const password = document.getElementById("password").value;

    if(!password){
        showOutput(`<div class="result-title">⚠️ Input Required</div><div>Please enter a password.</div>`, "result-info");
        return;
    }

    if(password.length < 4){
        showOutput(`<div class="result-title">⚠️ Too Short</div><div>Enter at least 4 characters.</div>`, "result-info");
        return;
    }

    showOutput(`<div class="loading">🔍 Checking password securely...</div>`, "result-info");

    try {
        const res = await fetch(API + "/check-password", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        addToHistory({
            type: "password",
            query: password.replace(/./g, "*"),
            date: new Date().toISOString(),
            result: data
        });

        if(data.error){
            showOutput(`<div class="result-title">❌ Error</div><div>${data.error}</div>`, "result-info");
            return;
        }

        // PASSWORD COMPROMISED — show generator button only here
        if(data.breached && data.count > 0){
            showOutput(`
                <div class="result-title">🚨 Password Compromised!</div>
                <div>This password has appeared <strong>${data.count.toLocaleString()}</strong> times in data breaches.</div>
                <br>
                <button onclick="window.location.href='password-generator.html'" class="btn-primary fadeIn">
                    🔐 Generate a Strong Password
                </button>
            `, "result-breach");

        } else {
            showOutput(`
                <div class="result-title">✅ Password Safe!</div>
                <div>No breach found for this password.</div>
            `, "result-safe");
        }

    } catch(err){
        showOutput(`<div class="result-title">❌ Connection Error</div><div>${err.message}</div>`, "result-info");
    }
}

/* --------------------------
    Dark Mode
---------------------------*/
const THEME_KEY = "theme_mode";

function setTheme(mode){
    if(mode === "dark"){
        document.documentElement.setAttribute("data-theme","dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }

    localStorage.setItem(THEME_KEY, mode);

    // update icon
    const btn = document.getElementById("themeToggle");
    if(btn){
        btn.textContent = mode === "dark" ? "☀️" : "🌙";
    }
}

/* --------------------------
    Event Listeners
---------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("checkEmailBtn").onclick = checkBDEmail;
    document.getElementById("checkPasswordBtn").onclick = checkPassword;

    // History modal
    document.getElementById("historyBtn").onclick = () => {
        document.getElementById("historyModal").style.display = "flex";
        renderHistory();
    };
    document.getElementById("closeHistory").onclick = () =>
        document.getElementById("historyModal").style.display = "none";

    document.getElementById("clearHistory").onclick = () => {
        localStorage.removeItem(KEY);
        renderHistory();
    };

    // Theme Button — THE FIX
    const saved = localStorage.getItem(THEME_KEY) || "light";
    setTheme(saved);

    const toggleBtn = document.getElementById("themeToggle");
    if(toggleBtn){
        toggleBtn.addEventListener("click", () => {
            const current = localStorage.getItem(THEME_KEY) || "light";
            const next = current === "dark" ? "light" : "dark";
            setTheme(next);
        });
    }
});
