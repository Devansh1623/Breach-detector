import React, { useState } from "react";
import Navbar from "./Navbar";
import { addHistory } from "../utils/history";
import { exportBreachReportPDF } from "../utils/pdfExport";

export default function UrlChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function checkUrl() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:3000/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setResult(data);

      addHistory({
        type: "url",
        value: url,
        time: Date.now(),
        result: data
      });
    } catch {
      setResult({ error: true, message: "Failed to fetch" });
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080616] text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto pt-32 p-6">
        <h1 className="text-4xl font-bold mb-4 neon">URL Safety Checker</h1>

        <div className="glow-card result-card">
          <input
            className="w-full p-4 bg-black/30 rounded"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={checkUrl}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"
          >
            {loading ? "Checking..." : "Check URL"}
          </button>
        </div>

        {result && !result.error && (
          <div className="mt-6 glow-card result-card">
            <h2 className="text-xl font-bold">Verdict: {result.verdict.toUpperCase()}</h2>
            <ul className="mt-4 list-disc ml-5">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <button
              onClick={() =>
                exportBreachReportPDF({ type: "url", query: url, result })
              }
              className="mt-4 px-4 py-2 bg-white/10 rounded"
            >
              📄 Export PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
