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
    if(!email) return showOutput("<div class='result-title'>⚠️ Enter Email</div>", "result-info");

    showOutput("<div class='loading'>🔍 Checking...</div>", "result-info");

    const res = await fetch(API + "/check-email-bd", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email})
    });

    const data = await res.json();
    addToHistory({ type:"email", query:email, date:new Date().toISOString(), result:data });

    if(data.breached){
        showOutput(`
            <div class='result-title'>⚠️ Breaches Found!</div>
            <div>${data.data.length} breaches detected.</div>
        `, "result-breach");
    } else {
        showOutput(`
            <div class='result-title'>✅ Safe</div>
            <div>No breaches found.</div>
        `, "result-safe");
    }
}

/* --------------------------
    Password Checker (HIBP)
---------------------------*/
async function checkPassword(){
    const password = document.getElementById("password").value;
    if(!password) return showOutput("⚠️ Enter a password", "result-info");

    showOutput("<div class='loading'>🔍 Checking...</div>", "result-info");

    const res = await fetch(API + "/check-password", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({password})
    });

    const data = await res.json();
    addToHistory({
        type:"password",
        query: password.replace(/./g, "*"),
        date:new Date().toISOString(),
        result:data
    });

    if(data.breached){
        showOutput(`
            <div class='result-title'>🚨 Password Compromised</div>
            <div>Seen ${data.count.toLocaleString()} times.</div>
        `, "result-breach");
    } else {
        showOutput(`
            <div class='result-title'>✅ Password Safe</div>
            <div>No breach found.</div>
        `, "result-safe");
    }
}

/* --------------------------
    Dark Mode
---------------------------*/
const THEME_KEY = "theme_mode";
function setTheme(mode){
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(THEME_KEY, mode);
    document.getElementById("themeToggle").textContent = mode === "dark" ? "☀️" : "🌙";
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

    // Theme
    const saved = localStorage.getItem(THEME_KEY) || "light";
    setTheme(saved);
});
