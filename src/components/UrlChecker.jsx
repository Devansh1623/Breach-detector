import React, { useState } from "react";
import { post } from "../utils/api";
import Navbar from "./Navbar";
import { addHistory } from "../utils/history";
import { useTranslation } from "react-i18next";
import { exportBreachReportPDF } from "../utils/pdfExport";

export default function UrlChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  async function checkUrl() {
    setLoading(true);
    setResult(null);


    try {
      const data = await post("/check-url", { url });
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
    <div className="min-h-screen text-white font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-32 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">{t('urlChecker.title')}</h1>
        <div className="glass-panel p-8">
          <div className="flex gap-4 items-center">
            <input
              className="glass-input flex-1"
              placeholder={t('urlChecker.placeholder')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  setUrl(text);
                } catch { }
              }}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition border border-white/10"
              title={t('common.paste')}
            >
              {t('common.paste')}
            </button>
          </div>
          <div className="mt-6">
            <button
              onClick={checkUrl}
              className="glass-button w-full py-3 text-lg font-bold tracking-wide uppercase"
              disabled={loading}
            >
              {loading ? t('urlChecker.checking') : t('urlChecker.button')}
            </button>
          </div>
        </div>
        {result && !result.error && (
          <div className="mt-6 glass-panel p-6 animate-slideUp">
            <h2 className="text-xl font-bold mb-4 text-white">
              {t('urlChecker.verdict')}: <span className={result.verdict === 'safe' ? 'text-green-400' : 'text-red-400'}>{result.verdict.toUpperCase()}</span>
            </h2>
            <ul className="space-y-2 text-gray-200">
              {result.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-400">•</span> {r}
                </li>
              ))}
            </ul>
            <button
              onClick={() => exportBreachReportPDF({ type: "url", query: url, result })}
              className="mt-6 px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition text-sm font-medium"
            >
              {t('urlChecker.exportPDF')}
            </button>
          </div>
        )}
        {result && result.error && (
          <div className="mt-6 glass-panel p-6 border border-red-500/30 bg-red-500/10">
            <div className="text-red-400 font-bold mb-1">{t('error.title')}</div>
            <div className="text-gray-200">{result.message}</div>
          </div>
        )}
      </div>
    </div>
  );
}
