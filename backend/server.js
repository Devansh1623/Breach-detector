// -------------------------------
//  Dependencies
// -------------------------------
import express from "express";
import axios from "axios";
import crypto from "crypto";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
//  CONFIG
// -------------------------------
const HIBP_API_KEY = process.env.HIBP_API_KEY;
const BREACH_DIRECTORY_API_KEY = process.env.BREACH_DIRECTORY_API_KEY || "free";
const PORT = process.env.PORT || 3000;

// -------------------------------
//  ROOT ROUTE
// -------------------------------
app.get("/", (req, res) => {
    res.json({ message: "Breach Checker API is running" });
});

// -------------------------------
//  CHECK EMAIL USING HIBP (PAID)
// -------------------------------
app.post("/check-email-hibp", async (req, res) => {
    const { email } = req.body;

    if (!email) return res.json({ error: "Email is required" });

    if (!HIBP_API_KEY) {
        return res.json({ error: "HIBP API key not configured" });
    }

    try {
        const resp = await axios.get(
            `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
            {
                headers: {
                    "hibp-api-key": HIBP_API_KEY,
                    "user-agent": "BreachChecker"
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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
