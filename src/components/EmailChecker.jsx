import React, { useState } from "react";
import Navbar from "./Navbar";
import { addHistory } from "../utils/history";
import { exportBreachReportPDF } from "../utils/pdfExport";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailChecker() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function validateEmail(value) {
    return EMAIL_REGEX.test(value);
  }

  async function checkEmail() {
    if (!email.trim()) return;
    if (!validateEmail(email)) {
      setResult({ error: true, message: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setResult(null);

    // client-side demo short-circuit
    if (email.toLowerCase() === "demo-breach@example.com") {
      const demo = {
        breached: true,
        data: ["Demo Leak: ExampleCorp 2023", "Demo Leak: SampleDB 2024"]
      };
      setResult(demo);
      addHistory({ type: "email", value: email, time: Date.now(), result: demo });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/check-email-bd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setResult(data);
      addHistory({ type: "email", value: email, time: Date.now(), result: data });
    } catch (err) {
      setResult({ error: true, message: err.message || "Network error" });
    }
    setLoading(false);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  function renderTips() {
    // context-aware tips
    if (!result) {
      return (
        <div className="mt-4 text-sm text-gray-300">
          Tips: Use a unique strong password for each account and enable 2FA where possible.
        </div>
      );
    }

    if (result.error) {
      return <div className="mt-4 text-sm text-yellow-300">Error: {result.message}</div>;
    }

    if (result.breached) {
      return (
        <div className="mt-4 text-sm text-gray-200">
          <strong>Security tips:</strong>
          <ul className="list-disc ml-5 mt-2 text-gray-300">
            <li>Reset your password immediately on affected services.</li>
            <li>Enable two-factor authentication (2FA).</li>
            <li>Use a password manager to create unique passwords.</li>
          </ul>
        </div>
      );
    }

    return (
      <div className="mt-4 text-sm text-green-200">
        Good news — no breaches found. Still consider a strong unique password plus 2FA.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080616] text-white dark:bg-white dark:text-black page-fade">

      <Navbar />
      <div className="max-w-2xl mx-auto pt-40 p-6">
        <h1 className="text-4xl font-bold mb-4 neon">Email Breach Checker</h1>

        <div className="glow-card result-card">
          <div className="flex gap-3 items-center">
            <input
              className="flex-1 p-4 bg-black/30 border border-white/6 rounded-lg mb-0 text-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="email-input"
            />
            <button onClick={copyEmail} className="px-3 py-2 bg-white/6 rounded">
              {copied ? "Copied" : "📋 Copy"}
            </button>
            <button
              onClick={() => setEmail("demo-breach@example.com")}
              className="px-3 py-2 bg-white/6 rounded"
              title="Use demo breached email"
            >
              Demo
            </button>
          </div>

          <div className="mt-3 flex gap-3">
            <button onClick={checkEmail} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg pulse">
              {loading ? "Checking…" : "Check Email"}
            </button>

            {result && !result.error && result.breached && (
              <button
                onClick={() => exportBreachReportPDF({ type: "email", query: email, result })}
                className="px-4 py-2 bg-white/6 rounded-lg"
              >
                📄 Export PDF
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          {!result && <div className="text-gray-400">Enter an email and click Check.</div>}

          {result && result.error && (
            <div className="mt-4 result-card glow-card">
              <div className="text-red-400 font-semibold">Error</div>
              <div className="text-sm text-gray-300">{result.message}</div>
            </div>
          )}

          {result && !result.error && result.breached && (
            <div className="mt-4 result-card glow-card border-l-4 border-orange-400">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-xl">⚠️ Breaches Found</div>
                  <div className="text-sm text-gray-300 mt-1">This email was found in {result.data.length} breach(es).</div>
                </div>
                <div>
                  <a href="https://accounts.google.com/signin/v2/recoveryidentifier" className="px-3 py-2 bg-white/6 rounded">Reset on Google</a>
                </div>
              </div>

              <ul className="mt-4 list-disc ml-5 text-gray-200">
                {result.data.map((b, i) => <li key={i} className="py-1">{b}</li>)}
              </ul>

              {renderTips()}
            </div>
          )}

          {result && !result.error && !result.breached && (
            <div className="mt-4 result-card glow-card border-l-4 border-green-500">
              <div className="font-bold text-lg">✅ Good News</div>
              <div className="text-gray-300 mt-2">This email was not found in known breaches.</div>
              {renderTips()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
