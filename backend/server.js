// -------------------------------
//  Dependencies
// -------------------------------
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
//  CONFIG (EDIT THIS)
// -------------------------------
const HIBP_API_KEY = "YOUR_HIBP_API_KEY"; 
const BREACH_DIRECTORY_API_KEY = process.env.BREACH_DIRECTORY_API_KEY;
// free tier key

// -------------------------------
//  CHECK EMAIL USING HIBP (PAID)
// -------------------------------
app.post("/check-email-hibp", async (req, res) => {
    const { email } = req.body;

    if (!email) return res.json({ error: "Email is required" });

    try {
        const resp = await axios.get( https://breachdirectory.com/api?email=${email}&apiKey=${BREACH_DIRECTORY_API_KEY} );
        const resp = await axios.get(
            `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
            {
                headers: {
                    "hibp-api-key": HIBP_API_KEY,
                    "user-agent": "YourAppName"
                }
            }
        );

        return res.json({ breached: true, data: resp.data });

    } catch (err) {
        if (err.response && err.response.status === 404)
            return res.json({ breached: false, data: [] });

        return res.json({ error: "HIBP Error", details: err.message });
    }
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
        return res.json({ error: "BreachDirectory Error", details: err.message });
    }
});

// -------------------------------
//  CHECK PASSWORD USING HIBP RANGE API (FREE)
// -------------------------------
app.post("/check-password", async (req, res) => {
    const { password } = req.body;

    if (!password) return res.json({ error: "Password is required" });

    // Hash password (SHA1)
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    try {
        const resp = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
        const lines = resp.data.split("\n");

        let foundCount = 0;
        lines.forEach(line => {
            const [hashSuffix, count] = line.split(":");
            if (hashSuffix.trim() === suffix) foundCount = parseInt(count);
        });

        return res.json({
            breached: foundCount > 0,
            count: foundCount
        });

    } catch (err) {
        return res.json({ error: "HIBP Password API Error", details: err.message });
    }
});

// -------------------------------
//  START SERVER
// -------------------------------
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

