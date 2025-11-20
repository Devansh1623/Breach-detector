import React, { useState } from "react";
import Navbar from "./Navbar";
import PasswordStrengthBar from "./PasswordStrengthBar";
import PasswordGenerator from "./PasswordGenerator";
import { calculateStrength } from "../utils/strength";
import { addHistory } from "../utils/history";
import { exportBreachReportPDF } from "../utils/pdfExport";

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const strength = calculateStrength(password);

  async function checkPassword() {
    if (!password) return;
    setLoading(true);
    setResult(null);

    if (password === "demo-compromised") {
      const demo = { breached: true, count: 12345 };
      setResult(demo);
      addHistory({ type: "password", value: "●●●●●", time: Date.now(), result: demo });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setResult(data);
      addHistory({ type: "password", value: "●●●●●", time: Date.now(), result: data });
    } catch (err) {
      setResult({ error: true, message: err.message || "Network error" });
    }
    setLoading(false);
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  function renderTips() {
    if (!password) {
      return <div className="mt-4 text-sm text-gray-300">Tip: Use at least 12 characters, mix cases, numbers and symbols.</div>;
    }
    if (strength < 50) {
      return (
        <div className="mt-4 text-sm text-yellow-300">
          Weak password: Consider increasing length and adding symbols and numbers.
        </div>
      );
    }
    return <div className="mt-4 text-sm text-green-300">Strong password—good job. Still use unique passwords per site.</div>;
  }

  return (
     <div className="min-h-screen bg-[#080616] text-white dark:bg-white dark:text-black page-fade">

      <Navbar />
      <div className="max-w-2xl mx-auto pt-40 p-6">
        <h1 className="text-4xl font-bold mb-4 neon">Password Breach & Generator</h1>

        <div className="glow-card result-card">
          <div className="flex gap-3 items-center">
            <input
              className="flex-1 p-4 bg-black/30 border border-white/6 rounded-lg mb-0 text-white"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={copyPassword} className="px-3 py-2 bg-white/6 rounded">
              {copied ? "Copied" : "📋 Copy"}
            </button>
          </div>

          <PasswordStrengthBar score={calculateStrength(password)} />

          <div className="mt-4 flex gap-3">
            <button onClick={checkPassword} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg pulse">
              {loading ? "Checking…" : "Check Password"}
            </button>

            <PasswordGenerator onGenerate={(p) => setPassword(p)} />

            {result && !result.error && result.breached && (
              <button onClick={() => exportBreachReportPDF({ type: "password", query: "●●●●●", result })} className="px-4 py-2 bg-white/6 rounded-lg">
                📄 Export PDF
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          {result && result.error && (
            <div className="result-card glow-card">
              <div className="text-red-400">Error</div>
              <div className="text-sm text-gray-300">{result.message}</div>
            </div>
          )}

          {result && !result.error && result.breached && (
            <div className="mt-4 result-card glow-card border-l-4 border-orange-400">
              <div className="font-bold text-xl">🚨 Password Compromised</div>
              <div className="text-sm text-gray-300 mt-1">This password was seen {result.count?.toLocaleString()} times in breaches.</div>
              {renderTips()}
            </div>
          )}

          {result && !result.error && !result.breached && (
            <div className="mt-4 result-card glow-card border-l-4 border-green-500">
              <div className="font-bold">✅ Password Not Found</div>
              <div className="text-gray-300 mt-1">This password does not appear in public breaches.</div>
              {renderTips()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
