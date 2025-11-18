// -------------------------------
//  Dependencies
// -------------------------------
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
//  CONFIG
// -------------------------------
const BREACH_DIRECTORY_API_KEY = process.env.BREACH_DIRECTORY_API_KEY; // Free API key

// -------------------------------
//  ROOT ROUTE (Prevents Render 404)
// -------------------------------
app.get("/", (req, res) => {
    res.send("Breach Checker API is running 🚀");
});

// -------------------------------
//  CHECK EMAIL USING BREACH DIRECTORY (FREE)
// -------------------------------
app.post("/check-email-bd", async (req, res) => {
    const { email } = req.body;

    if (!email) return res.json({ error: "Email is required" });

    try {
        const resp = await axios.get(
            `https://breachdirectory.com/api?email=${email}&apiKey=${BREACH_DIRECTORY_API_KEY}`
        );

        return res.json({
            breached: resp.data.success && resp.data.found,
            data: resp.data.result || []
        });

    } catch (err) {
        return res.json({ 
            error: "BreachDirectory Error", 
            details: err.message 
        });
    }
});

// -------------------------------
//  CHECK PASSWORD USING HIBP RANGE API (FREE)
// -------------------------------
app.post("/check-password", async (req, res) => {
    const { password } = req.body;

    if (!password) return res.json({ error: "Password is required" });

    // SHA-1 hash of password
    const sha1 = crypto.createHash("sha1")
        .update(password)
        .digest("hex")
        .toUpperCase();

    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    try {
        const resp = await axios.get(
            `https://api.pwnedpasswords.com/range/${prefix}`
        );

        const lines = resp.data.split("\n");

        let foundCount = 0;
        lines.forEach(line => {
            const [hashSuffix, count] = line.split(":");
            if (hashSuffix.trim() === suffix) {
                foundCount = parseInt(count);
            }
        });

        return res.json({
            breached: foundCount > 0,
            count: foundCount
        });

    } catch (err) {
        return res.json({ 
            error: "HIBP Password API Error", 
            details: err.message 
        });
    }
});

// -------------------------------
//  START SERVER
// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
