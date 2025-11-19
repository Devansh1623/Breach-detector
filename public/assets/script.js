/* unified script.js for landing + email-checker + password-checker
   - demo-breach: "demo-breach@example.com" always returns breached
   - maintains generator, history, dark mode, HIBP password check
*/

const API = window.location.origin;

// showOutput helper (page-specific: output element must exist)
function showOutput(html, className){
    const out = document.getElementById("output");
    if(!out) return;
    out.innerHTML = html;
    out.className = "result " + className + " fadeIn";
    out.style.display = "block";
    out.scrollIntoView({ behavior:"smooth" });
}

/* --------------------------
    History (Frontend only)
---------------------------*/
const KEY = "breach_history_v1";
function loadHistory(){ try{ return JSON.parse(localStorage.getItem(KEY) || "[]") }catch(e){ return [] } }
function saveHistory(arr){ localStorage.setItem(KEY, JSON.stringify(arr)) }
function addToHistory(entry){ const h = loadHistory(); h.unshift(entry); if(h.length>200) h.pop(); saveHistory(h); renderHistory(); }
function renderHistory(){
    const list = document.getElementById("historyList");
    if(!list) return;
    const arr = loadHistory();
    if(arr.length === 0){ list.innerHTML = "<div class='empty'>No history yet.</div>"; return; }
    list.innerHTML = arr.map(item=>{
        const time = new Date(item.date).toLocaleString();
        const icon = item.result && item.result.breached ? "⚠️" : "✅";
        return `<div class="hist-item fadeIn"><div><strong>${item.query}</strong><div class="hist-meta">${item.type} · ${time}</div></div><div>${icon}</div></div>`;
    }).join("");
}

/* --------------------------
    Password Generator
---------------------------*/
function generatePassword() {
    const length = 14;
    const chars = { upper:"ABCDEFGHIJKLMNOPQRSTUVWXYZ", lower:"abcdefghijklmnopqrstuvwxyz", numbers:"0123456789", symbols:"!@#$%^&*()-_=+[]{};:,.<>/?" };
    let pwd = "";
    pwd += chars.upper[Math.floor(Math.random()*chars.upper.length)];
    pwd += chars.lower[Math.floor(Math.random()*chars.lower.length)];
    pwd += chars.numbers[Math.floor(Math.random()*chars.numbers.length)];
    pwd += chars.symbols[Math.floor(Math.random()*chars.symbols.length)];
    const all = chars.upper + chars.lower + chars.numbers + chars.symbols;
    while(pwd.length < length) pwd += all[Math.floor(Math.random()*all.length)];
    return pwd.split('').sort(()=>Math.random()-0.5).join('');
}

/* --------------------------
    Email Checker (calls backend)
---------------------------*/
async function checkBDEmail(){
    const emailInput = document.getElementById("email");
    if(!emailInput) return;
    const email = emailInput.value.trim();
    if(!email){ showOutput(`<div class="result-title">⚠️ Input Required</div><div>Please enter an email address.</div>`,'result-info'); return; }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!re.test(email)){ showOutput(`<div class="result-title">⚠️ Invalid Email</div><div>Please enter a valid email address.</div>`,'result-info'); return; }

    /* demo email always breached (client-side quick path) */
    if(email.toLowerCase() === "demo-breach@example.com"){
        const demo = { breached:true, data:["Demo Leak A","Demo Leak B","Demo Leak C"] };
        addToHistory({ type:"email", query:email, date:new Date().toISOString(), result: demo });
        showOutput(`<div class="result-title">⚠️ Demo Email Breached</div><ul style="padding-left:18px">${demo.data.map(d=>`<li>${d}</li>`).join("")}</ul><br><button onclick="window.location.href='https://accounts.google.com/signin/v2/recoveryidentifier'" class="btn-primary fadeIn">🔐 Reset Password on Google</button>`,'result-breach');
        return;
    }

    showOutput(`<div class="loading">🔍 Checking email for breaches...</div>`,'result-info');
    try{
        const res = await fetch(API + "/check-email-bd", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email }) });
        const data = await res.json();
        addToHistory({ type:"email", query:email, date:new Date().toISOString(), result: data });
        if(data.error){ showOutput(`<div class="result-title">❌ Error</div><div>${data.error}</div>`,'result-info'); return; }

        if(data.breached && data.data && data.data.length > 0){
            const list = data.data.map(b=>`<li>${b}</li>`).join("");
            showOutput(`<div class="result-title">⚠️ Email Found in ${data.data.length} Breach(es)</div><ul style="padding-left:18px">${list}</ul><br><div><strong>Actions:</strong></div><ul style="padding-left:18px"><li>Reset password</li><li>Enable 2FA</li></ul><br><button onclick="window.location.href='https://accounts.google.com/signin/v2/recoveryidentifier'" class="btn-primary fadeIn">🔐 Reset Password on Google</button>`,'result-breach');
        } else {
            showOutput(`<div class="result-title">✅ Good News!</div><div>This email was not found in known breaches.</div>`,'result-safe');
        }
    }catch(err){
        showOutput(`<div class="result-title">❌ Connection Error</div><div>${err.message}</div>`,'result-info');
    }
}

/* --------------------------
    Password Checker (calls backend HIBP range)
---------------------------*/
async function checkPassword(){
    const pwInput = document.getElementById("password");
    if(!pwInput) return;
    const password = pwInput.value;
    if(!password){ showOutput(`<div class="result-title">⚠️ Input Required</div><div>Please enter a password.</div>`,'result-info'); return; }
    if(password.length < 4){ showOutput(`<div class="result-title">⚠️ Too Short</div><div>Enter at least 4 characters.</div>`,'result-info'); return; }

    showOutput(`<div class="loading">🔍 Checking password securely...</div>`,'result-info');
    try{
        const res = await fetch(API + "/check-password", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ password })});
        const data = await res.json();
        addToHistory({ type:"password", query: password.replace(/./g,"*"), date:new Date().toISOString(), result:data });
        if(data.error){ showOutput(`<div class="result-title">❌ Error</div><div>${data.error}</div>`,'result-info'); return; }

        if(data.breached && data.count > 0){
            showOutput(`<div class="result-title">🚨 Password Compromised!</div><div>Seen ${data.count.toLocaleString()} times.</div><br><button onclick="window.location.href='password-checker.html'" class="btn-primary fadeIn">🔐 Generate Strong Password</button>`,'result-breach');
        } else {
            showOutput(`<div class="result-title">✅ Password Safe!</div><div>No breach found for this password.</div>`,'result-safe');
        }
    }catch(err){
        showOutput(`<div class="result-title">❌ Connection Error</div><div>${err.message}</div>`,'result-info');
    }
}

/* --------------------------
    Dark Mode
---------------------------*/
const THEME_KEY = "theme_mode";
function setTheme(mode){
    if(mode === "dark") document.documentElement.setAttribute("data-theme","dark");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, mode);
    const btn = document.getElementById("themeToggle");
    if(btn) btn.textContent = mode === "dark" ? "☀️" : "🌙";
}

/* --------------------------
    Bind UI (page-aware)
---------------------------*/
document.addEventListener("DOMContentLoaded", ()=>{
    // password generator UI
    const genBtn = document.getElementById("generatePasswordBtn");
    const genOut = document.getElementById("generatedPassword");
    const copyBtn = document.getElementById("copyPasswordBtn");

    if(genBtn){
        genBtn.onclick = ()=>{
            const p = generatePassword();
            if(genOut) genOut.textContent = p;
            const inpw = document.getElementById("password");
            if(inpw) inpw.value = p;
        };
    }
    if(copyBtn){
        copyBtn.onclick = ()=>{
            const p = genOut ? genOut.textContent : "";
            if(p && p.length) { navigator.clipboard.writeText(p); alert("Password copied!"); }
        };
    }

    // page-specific buttons
    const checkEmailBtn = document.getElementById("checkEmailBtn");
    if(checkEmailBtn) checkEmailBtn.onclick = checkBDEmail;
    const checkPasswordBtn = document.getElementById("checkPasswordBtn");
    if(checkPasswordBtn) checkPasswordBtn.onclick = checkPassword;

    // history modal
    const historyBtn = document.getElementById("historyBtn");
    if(historyBtn) historyBtn.onclick = ()=>{ const m = document.getElementById("historyModal"); if(m) { m.style.display='flex'; renderHistory(); } };
    const closeHistory = document.getElementById("closeHistory");
    if(closeHistory) closeHistory.onclick = ()=>{ const m = document.getElementById("historyModal"); if(m) m.style.display='none'; };
    const clearHistory = document.getElementById("clearHistory");
    if(clearHistory) clearHistory.onclick = ()=>{ localStorage.removeItem(KEY); renderHistory(); };

    // theme
    const saved = localStorage.getItem(THEME_KEY) || "light";
    setTheme(saved);
    const toggleBtn = document.getElementById("themeToggle");
    if(toggleBtn) toggleBtn.addEventListener("click", ()=>{ const cur = localStorage.getItem(THEME_KEY) || "light"; setTheme(cur === "dark" ? "light" : "dark"); });
});
