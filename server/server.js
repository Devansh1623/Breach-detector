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
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

// Path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------
// FORCE dotenv to load ONLY in development
// -------------------------------
if (process.env.NODE_ENV !== "production") {
  process.env.DOTENV_KEY = "disable_auto_inject";
  dotenv.config({
    path: path.resolve(__dirname, "../.env"),
    override: true,
    debug: false
  });
  console.log("Loaded Backend ENV (Dev)");
}

// -------------------------------
// Express App
// -------------------------------
const app = express();

// CORS Configuration (Production Ready)
app.use(cors({
  origin: (origin, cb) => {
    // allow same-origin or no-origin (non-browser)
    if (!origin) return cb(null, true);

    const allowed = [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL // Optional: Set in Render if needed
    ].filter(Boolean);

    // Allow allowed origins OR any Render deployment
    if (allowed.includes(origin) || (process.env.NODE_ENV === "production" && origin.endsWith(".onrender.com"))) {
      return cb(null, true);
    }

    // Fallback for testing (remove in strict production if needed)
    // return cb(null, true); 
    return cb(new Error("CORS blocked by server"), false);
  },
  credentials: true
}));

app.use(express.json());

// -------------------------------
// Security Middleware
// -------------------------------

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://ipwho.is"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 10 * 60 * 1000, // 10 minutes
  message: "Too many requests from this IP, please try again in 10 minutes!"
});
app.use("/", limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// -------------------------------
// MongoDB Connection
// -------------------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/breach_detector")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// -------------------------------
// AUTH ROUTES (Signup, Login)
// -------------------------------
import authRoutes from "./routes/auth.js";
app.use("/auth", authRoutes);

// -------------------------------
// SECURITY ROUTES (existing)
// -------------------------------
import securityRoutes from "./routes/securityChecks.js";
app.use("/", securityRoutes);

// -------------------------------
// API ROUTES (Move ABOVE static assets)
// -------------------------------

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", env: process.env.NODE_ENV });
});

// Email Breach Checker (BreachDirectory)
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
    return res.json({ breached: breaches.length > 0, data: breaches });
  } catch (err) {
    return res.json({
      error: "Breach Directory API Error",
      details: err.message,
    });
  }
});

// Password Checker (HIBP)
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
// SERVE STATIC ASSETS (Production)
// -------------------------------
import fs from "fs";
const distPath = path.join(__dirname, "../dist");

if (fs.existsSync(distPath)) {
  // Serve static files from the 'dist' directory
  app.use(express.static(distPath));

  // Handle React routing, return all requests to React app
  app.get(/.*/, (req, res, next) => {
    // If request is for API, skip to next middleware
    if (req.path.startsWith("/auth") || req.path.startsWith("/check-") || req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log("DIST folder not found. Skipping static file serving (API Only Mode).");
}

// -------------------------------
// Start Server
// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log("Email configured:", !!process.env.EMAIL_HOST);
});
