import React, { useState } from "react";
import Navbar from "./Navbar";
import { addHistory } from "../utils/history";
import { exportBreachReportPDF } from "../utils/pdfExport";
import { useTranslation } from "react-i18next";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailChecker() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const validateEmail = (value) => EMAIL_REGEX.test(value);

  const checkEmail = async () => {
    if (!email.trim()) return;
    if (!validateEmail(email)) {
      setResult({ error: true, message: t('emailChecker.invalid') });
      return;
    }
    setLoading(true);
    setResult(null);
    // demo shortcut
    if (email.toLowerCase() === "demo-breach@example.com") {
      const demo = { breached: true, data: ["Demo Leak: ExampleCorp 2023", "Demo Leak: SampleDB 2024"] };
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
      setResult({ error: true, message: err.message || t('emailChecker.networkError') });
    }
    setLoading(false);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { }
  };

  const renderContent = () => {
    if (!result) {
      return <div className="mt-4 text-sm text-gray-100">{t('emailChecker.tip')}</div>;
    }
    if (result.error) {
      return <div className="mt-4 text-sm text-yellow-300">{t('emailChecker.error')}: {result.message}</div>;
    }
    if (result.breached) {
      return (
        <div className="mt-4 text-sm text-gray-100">
          <strong>{t('emailChecker.breachedIn')}</strong>
          <ul className="list-disc ml-5 mt-2 text-gray-100">
            {result.data && result.data.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      );
    }
    return <div className="mt-4 text-sm text-green-200">{t('emailChecker.safeAdvice')}</div>;
  };

  return (
    <div className="min-h-screen text-white page-fade font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-32 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">{t('emailChecker.title')}</h1>
        <div className="glass-panel p-8">
          <div className="flex gap-4 items-center">
            <input
              className="glass-input flex-1"
              placeholder={t('emailChecker.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="email-input"
            />
            <button
              onClick={copyEmail}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition border border-white/10"
            >
              {copied ? t('common.copied') : "📋"}
            </button>
            <button
              onClick={() => setEmail("demo-breach@example.com")}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition border border-white/10 text-sm font-medium"
              title={t('common.demo')}
            >
              {t('common.demo')}
            </button>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={checkEmail}
              className="glass-button px-8 py-3 w-full md:w-auto"
            >
              {loading ? t('emailChecker.checking') : t('emailChecker.button')}
            </button>
            {result && !result.error && result.breached && (
              <button
                onClick={() => exportBreachReportPDF({ type: "email", query: email, result })}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition border border-white/10 text-white"
              >
                {t('emailChecker.exportPDF')}
              </button>
            )}
          </div>
        </div>
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
