const API = "http://localhost:3000";

// HIBP Email (Paid)
async function checkHIBPEmail() {
    const email = document.getElementById("email").value;

    const res = await fetch(API + "/check-email-hibp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await res.json();
    document.getElementById("output").innerText = JSON.stringify(data, null, 2);
}

// BreachDirectory Email (Free)
async function checkBDEmail() {
    const email = document.getElementById("email").value;

    const res = await fetch(API + "/check-email-bd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await res.json();
    document.getElementById("output").innerText = JSON.stringify(data, null, 2);
}

// HIBP Password Check
async function checkPassword() {
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });

    const data = await res.json();
    document.getElementById("output").innerText = JSON.stringify(data, null, 2);
}
