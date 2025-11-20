// server/routes/securityChecks.js (ESM)
import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

import whois from "whois-json";

import { promises as dns } from "dns";

const router = express.Router();

// ------------------ URL HEURISTICS ------------------
function analyzeUrl(urlStr) {
  const reasons = [];
  let score = 0;

  try {
    const u = new URL(urlStr);

    if (u.protocol !== "https:") {
      score += 5;
      reasons.push("Not using HTTPS");
    }

    if (u.hostname.includes("xn--")) {
      score += 5;
      reasons.push("Punycode domain (possible homograph attack)");
    }

    if (urlStr.length > 150) {
      score += 3;
      reasons.push("Unusually long URL");
    }

    if (/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)) {
      score += 5;
      reasons.push("URL uses IP instead of domain");
    }

    if (urlStr.includes("@")) {
      score += 4;
      reasons.push("URL contains '@' — suspicious");
    }

  } catch (err) {
    return { verdict: "high", score: 20, reasons: ["Invalid URL"] };
  }

  return { score, reasons };
}

// ------------------ URL CHECKER ------------------
router.post("/check-url", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.json({ error: "No URL provided" });

  const result = analyzeUrl(url);

  try {
    const r = await fetch(url);
    const html = await r.text();
    const $ = cheerio.load(html);

    if ($("input[type=password]").length > 0) {
      result.reasons.push("Contains password input");
      result.score += 6;
    }

    if ($("iframe").length > 0) {
      result.reasons.push("Contains iframes");
      result.score += 3;
    }

  } catch {
    result.reasons.push("Could not fetch URL");
    result.score += 3;
  }

  // WHOIS age check
  try {
    const hostname = new URL(url).hostname;
    const who = await whois(hostname);

    const created = new Date(who.creationDate || who.createdDate);
    if (!isNaN(created)) {
      const ageDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
      if (ageDays < 90) {
        result.reasons.push("Domain is newly registered (<90 days)");
        result.score += 5;
      }
    }
  } catch {}

  const verdict =
    result.score >= 12 ? "high" :
    result.score >= 6 ? "medium" :
    "low";

  return res.json({ verdict, ...result });
});

// ------------------ PHISHING EMAIL CHECKER ------------------
router.post("/check-phishing-email", async (req, res) => {
  const { from, subject, body } = req.body;

  let score = 0;
  const reasons = [];
  const text = (subject + " " + body).toLowerCase();

  if (!from || !from.includes("@")) {
    score += 10;
    reasons.push("Invalid or missing sender address");
  } else {
    const domain = from.split("@")[1];
    try {
      const mx = await dns.resolveMx(domain);
      if (!mx.length) {
        score += 5;
        reasons.push("No MX records for domain");
      }
    } catch {
      score += 5;
      reasons.push("Failed MX lookup");
    }
  }

  const keywords = ["urgent", "verify", "password", "reset", "account", "bank", "click here"];
  keywords.forEach(k => {
    if (text.includes(k)) {
      score += 2;
      reasons.push(`Suspicious keyword: ${k}`);
    }
  });

  const verdict =
    score >= 12 ? "high" :
    score >= 6 ? "medium" :
    "low";

  return res.json({ verdict, score, reasons });
});

// Export
export default router;
