// Use same origin since frontend and backend are on same server
const API = window.location.origin;

// HIBP Email (Paid)
async function checkHIBPEmail() {
    const email = document.getElementById("email").value;
    
    if (!email) {
        document.getElementById("output").innerText = "Please enter an email";
        return;
    }

    document.getElementById("output").innerText = "Checking...";

    try {
        const res = await fetch(API + "/check-email-hibp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        document.getElementById("output").innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById("output").innerText = "Error: " + error.message;
    }
}

// BreachDirectory Email (Free)
async function checkBDEmail() {
    const email = document.getElementById("email").value;
    
    if (!email) {
        document.getElementById("output").innerText = "Please enter an email";
        return;
    }

    document.getElementById("output").innerText = "Checking...";

    try {
        const res = await fetch(API + "/check-email-bd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        document.getElementById("output").innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById("output").innerText = "Error: " + error.message;
    }
}

// HIBP Password Check
async function checkPassword() {
    const password = document.getElementById("password").value;
    
    if (!password) {
        document.getElementById("output").innerText = "Please enter a password";
        return;
    }

    document.getElementById("output").innerText = "Checking...";

    try {
        const res = await fetch(API + "/check-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
        });

        const data = await res.json();
        document.getElementById("output").innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById("output").innerText = "Error: " + error.message;
    }
}