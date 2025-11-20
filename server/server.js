// -------------------------------
// Dependencies
// -------------------------------
import express from "express";
import axios from "axios";
import crypto from "crypto";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from src/components/.env
dotenv.config({ path: path.resolve(__dirname, '../src/components/.env') });

// Create Express App BEFORE using routes
const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
// MongoDB Connection
// -------------------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/breach_detector", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// -------------------------------
// AUTH ROUTES (Signup, OTP, Login)
// -------------------------------
import authRoutes from "./routes/auth.js";
app.use("/auth", authRoutes);

// -------------------------------
// EXISTING SECURITY ROUTES
// -------------------------------
import securityRoutes from "./routes/securityChecks.js";
app.use("/", securityRoutes);

// -------------------------------
// Email Breach Checker (BreachDirectory)
// -------------------------------
app.post("/check-email-bd", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.json({ error: "Email is required" });

  // Demo response
  if (email.toLowerCase() === "demo-breach@example.com") {
    return res.json({
      breached: true,
      data: ["Demo Leak A", "Demo Leak B", "Demo Leak C"],
    });
  }

  try {
    const apiKey = process.env.BREACH_API_KEY;

    const url = `https://breachdirectory.com/api?email=${encodeURIComponent(
      email
    )}&apiKey=${apiKey}`;

    const resp = await axios.get(url);
    const body = resp.data;

    if (!body || body.success === false) {
      return res.json({ breached: false, data: [] });
    }

    const breaches = body.sources || [];
    return res.json({
      breached: breaches.length > 0,
      data: breaches,
    });
  } catch (err) {
    return res.json({
      error: "Breach Directory API Error",
      details: err.message,
    });
  }
});

// -------------------------------
// Password Checker (HIBP)
// -------------------------------
app.post("/check-password", async (req, res) => {
  const { password } = req.body;

  if (!password) return res.json({ error: "Password is required" });

  const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  try {
    const resp = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
    const lines = resp.data.split("\n");

    let found = 0;
    lines.forEach((line) => {
      const [hashSuffix, count] = line.split(":");
      if (hashSuffix.trim() === suffix) found = parseInt(count);
    });

    return res.json({
      breached: found > 0,
      count: found,
    });
  } catch (err) {
    return res.json({ error: "HIBP Error", details: err.message });
  }
});

// -------------------------------
// Start Server
// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log('Environment loaded from: src/components/.env');
  console.log('Email configured:', !!process.env.EMAIL_HOST);
});