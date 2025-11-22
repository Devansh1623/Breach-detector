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
  } catch { }

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

// ------------------ OWASP CONFIGURATION SCANNER ------------------
router.post("/scan-owasp", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.json({ error: "No URL provided" });

  try {
    const r = await fetch(url);
    const headers = r.headers;
    const findings = [];
    let score = 100; // Start with perfect score

    // 1. Missing Security Headers (OWASP A05:2021)
    const securityHeaders = [
      {
        name: "content-security-policy",
        penalty: 20,
        msg: "Missing Content-Security-Policy (CSP)",
        desc: "CSP prevents Cross-Site Scripting (XSS) by controlling which resources the user agent is allowed to load.",
        fix: "Configure your server to send a 'Content-Security-Policy' header. Start with a restrictive policy like `default-src 'self'`."
      },
      {
        name: "strict-transport-security",
        penalty: 20,
        msg: "Missing Strict-Transport-Security (HSTS)",
        desc: "HSTS tells browsers that the site should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be converted to HTTPS.",
        fix: "Enable HSTS on your web server. Example: `Strict-Transport-Security: max-age=31536000; includeSubDomains`."
      },
      {
        name: "x-frame-options",
        penalty: 10,
        msg: "Missing X-Frame-Options",
        desc: "This header indicates whether or not a browser should be allowed to render a page in a <frame>, <iframe>, <embed> or <object>. It helps avoid Clickjacking attacks.",
        fix: "Set the header to `DENY` or `SAMEORIGIN` to prevent your site from being embedded in iframes on other sites."
      },
      {
        name: "x-content-type-options",
        penalty: 10,
        msg: "Missing X-Content-Type-Options",
        desc: "This header prevents the browser from 'sniffing' the response content type away from the declared Content-Type.",
        fix: "Set the header to `nosniff`."
      },
      {
        name: "referrer-policy",
        penalty: 5,
        msg: "Missing Referrer-Policy",
        desc: "Controls how much referrer information (sent via the Referer header) should be included with requests.",
        fix: "Set a Referrer-Policy header. Recommended: `strict-origin-when-cross-origin`."
      },
      {
        name: "permissions-policy",
        penalty: 5,
        msg: "Missing Permissions-Policy",
        desc: "Allows a site to define which features and APIs can be used in the browser.",
        fix: "Define a Permissions-Policy header to disable unused features like microphone, camera, geolocation, etc."
      }
    ];

    securityHeaders.forEach(h => {
      if (!headers.get(h.name)) {
        score -= h.penalty;
        findings.push({
          type: "missing_header",
          severity: "high",
          message: h.msg,
          description: h.desc,
          remediation: h.fix
        });
      }
    });

    // 2. Information Leaks (OWASP A05:2021)
    if (headers.get("x-powered-by")) {
      score -= 10;
      findings.push({
        type: "info_leak",
        severity: "medium",
        message: `Server revealing technology: ${headers.get("x-powered-by")}`,
        description: "Revealing the specific technology (e.g., Express, PHP, ASP.NET) helps attackers target known vulnerabilities in that specific version.",
        remediation: "Configure your server or framework to remove or hide the 'X-Powered-By' header."
      });
    }
    if (headers.get("server")) {
      score -= 5;
      findings.push({
        type: "info_leak",
        severity: "low",
        message: `Server header present: ${headers.get("server")}`,
        description: "The 'Server' header describes the software used by the web server. Detailed version info can aid attackers.",
        remediation: "Configure your web server to suppress the 'Server' header or provide generic information."
      });
    }

    // 3. Cookie Security (OWASP A05:2021)
    const setCookie = headers.get("set-cookie");
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookies.forEach(c => {
        if (!c.toLowerCase().includes("secure")) {
          score -= 10;
          findings.push({
            type: "insecure_cookie",
            severity: "medium",
            message: "Cookie missing 'Secure' flag",
            description: "Cookies without the 'Secure' flag can be transmitted over unencrypted HTTP connections, making them vulnerable to interception.",
            remediation: "Ensure all cookies are set with the 'Secure' attribute."
          });
        }
        if (!c.toLowerCase().includes("httponly")) {
          score -= 10;
          findings.push({
            type: "insecure_cookie",
            severity: "medium",
            message: "Cookie missing 'HttpOnly' flag",
            description: "Cookies without the 'HttpOnly' flag can be accessed by JavaScript, making them vulnerable to XSS attacks.",
            remediation: "Ensure sensitive cookies (like session IDs) are set with the 'HttpOnly' attribute."
          });
        }
      });
    }

    // 4. SSL/TLS Check (OWASP A02:2021)
    if (!url.startsWith("https://")) {
      score -= 30;
      findings.push({
        type: "no_https",
        severity: "critical",
        message: "Website is not using HTTPS",
        description: "HTTP traffic is unencrypted and can be intercepted or modified by attackers.",
        remediation: "Migrate the website to HTTPS immediately using a valid SSL/TLS certificate."
      });
    }

    // Clamp score
    score = Math.max(0, score);

    // Determine Grade
    let grade = "F";
    if (score >= 90) grade = "A";
    else if (score >= 80) grade = "B";
    else if (score >= 70) grade = "C";
    else if (score >= 60) grade = "D";

    return res.json({
      url,
      grade,
      score,
      findings
    });

  } catch (err) {
    return res.json({ error: "Could not scan URL. It might be unreachable or blocking bots." });
  }
});

// ------------------ AI REMEDIATION ASSISTANT ------------------
import { GoogleGenAI } from "@google/genai";

router.post("/ask-ai", async (req, res) => {
  const { finding } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ error: "Gemini API Key is missing on the server." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `I am a security scanner. I found the following vulnerability on a website:
Type: ${finding.message}
Description: ${finding.description}

Please provide a concise, actionable, and technical explanation on how to fix this. 
Include code snippets (e.g., Nginx config, Apache .htaccess, or Express.js headers) if applicable.
Keep the answer under 200 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });

    return res.json({ answer: response.text });
  } catch (err) {
    console.error("AI Error Details:", err);
    return res.json({ error: `AI Error: ${err.message || "Failed to get response"}` });
  }
});

// Export
export default router;
