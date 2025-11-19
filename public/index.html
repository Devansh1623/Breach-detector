// Use same origin since frontend and backend are on same server
const API = window.location.origin;

// Show output with animation
function showOutput(html, className) {
    const output = document.getElementById("output");
    output.innerHTML = html;
    output.className = className;
    output.style.display = "block";
    
    // Scroll to output
    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// BreachDirectory Email Check
async function checkBDEmail() {
    const email = document.getElementById("email").value.trim();
    
    if (!email) {
        showOutput(
            `<div class="result-title">⚠️ Input Required</div>
             <div class="result-message">Please enter an email address.</div>`,
            "result-info"
        );
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showOutput(
            `<div class="result-title">⚠️ Invalid Email</div>
             <div class="result-message">Please enter a valid email address.</div>`,
            "result-info"
        );
        return;
    }

    showOutput(
        `<div class="loading">🔍 Checking email for breaches...</div>`,
        "result-info"
    );

    try {
        const res = await fetch(API + "/check-email-bd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.error) {
            showOutput(
                `<div class="result-title">❌ Error</div>
                 <div class="result-message">${data.error}</div>`,
                "result-info"
            );
            return;
        }

        if (data.breached && data.data.length > 0) {
            const breachList = data.data.map(breach => 
                `<li><strong>${breach}</strong></li>`
            ).join("");
            
            showOutput(
                `<div class="result-title">⚠️ Breaches Found!</div>
                 <div class="result-message">
                     This email has been found in <strong>${data.data.length}</strong> data breach(es):
                     <ul style="margin-top: 10px; padding-left: 20px;">
                         ${breachList}
                     </ul>
                     <p style="margin-top: 15px;"><strong>Recommendation:</strong> Change your passwords immediately and enable two-factor authentication.</p>
                 </div>`,
                "result-breach"
            );
        } else {
            showOutput(
                `<div class="result-title">✅ Good News!</div>
                 <div class="result-message">
                     This email was not found in any known data breaches.
                     <p style="margin-top: 10px;">Keep your account secure by using strong, unique passwords!</p>
                 </div>`,
                "result-safe"
            );
        }
    } catch (error) {
        showOutput(
            `<div class="result-title">❌ Connection Error</div>
             <div class="result-message">Unable to check email. Please try again later.<br><small>${error.message}</small></div>`,
            "result-info"
        );
    }
}

// HIBP Password Check
async function checkPassword() {
    const password = document.getElementById("password").value;
    
    if (!password) {
        showOutput(
            `<div class="result-title">⚠️ Input Required</div>
             <div class="result-message">Please enter a password.</div>`,
            "result-info"
        );
        return;
    }

    if (password.length < 4) {
        showOutput(
            `<div class="result-title">⚠️ Password Too Short</div>
             <div class="result-message">Please enter at least 4 characters.</div>`,
            "result-info"
        );
        return;
    }

    showOutput(
        `<div class="loading">🔍 Checking password securely...</div>`,
        "result-info"
    );

    try {
        const res = await fetch(API + "/check-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (data.error) {
            showOutput(
                `<div class="result-title">❌ Error</div>
                 <div class="result-message">${data.error}</div>`,
                "result-info"
            );
            return;
        }

        if (data.breached && data.count > 0) {
            showOutput(
                `<div class="result-title">🚨 Password Compromised!</div>
                 <div class="breach-count">Seen ${data.count.toLocaleString()} times in data breaches</div>
                 <div class="result-message">
                     <strong>This password is NOT safe to use!</strong>
                     <p style="margin-top: 10px;">This password has appeared in ${data.count.toLocaleString()} data breaches and should never be used.</p>
                     <p style="margin-top: 10px;"><strong>Action Required:</strong> Create a new, unique password immediately.</p>
                     <button onclick="window.location.href='password-generator.html'" class="btn-create-password">
                         🔐 Create a Stronger Password
                     </button>
                 </div>`,
                "result-breach"
            );
        } else {
            showOutput(
                `<div class="result-title">✅ Password Safe!</div>
                 <div class="result-message">
                     This password has not been found in any known data breaches.
                     <p style="margin-top: 10px;">However, always use strong, unique passwords for each account!</p>
                 </div>`,
                "result-safe"
            );
        }
    } catch (error) {
        showOutput(
            `<div class="result-title">❌ Connection Error</div>
             <div class="result-message">Unable to check password. Please try again later.<br><small>${error.message}</small></div>`,
            "result-info"
        );
    }
}