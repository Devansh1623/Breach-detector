import React, { useState } from "react";
import { post } from "../utils/api";
import Navbar from "./Navbar";
import PasswordStrengthBar from "./PasswordStrengthBar";
import PasswordGenerator from "./PasswordGenerator";
import { calculateStrength } from "../utils/strength";
import { addHistory } from "../utils/history";
import { exportBreachReportPDF } from "../utils/pdfExport";
import { useTranslation } from "react-i18next";

export default function PasswordChecker() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const strength = calculateStrength(password);

  const validatePassword = (value) => value.length > 0; // simple validation

  const checkPassword = async () => {
    if (!validatePassword(password)) return;
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
      const data = await post("/check-password", { password });
      setResult(data);
      addHistory({ type: "password", value: "●●●●●", time: Date.now(), result: data });
    } catch (err) {
      setResult({ error: true, message: err.message || t('passwordChecker.networkError') });
    }
    setLoading(false);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { }
  };

  const renderTips = () => {
    if (!password) {
      return <div className="mt-4 text-sm text-gray-100">{t('passwordChecker.tips.default')}</div>;
    }
    if (strength < 50) {
      return <div className="mt-4 text-sm text-yellow-300">{t('passwordChecker.tips.weak')}</div>;
    }
    return <div className="mt-4 text-sm text-green-300">{t('passwordChecker.tips.strong')}</div>;
  };

  return (
    <div className="min-h-screen text-white font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-32 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">{t('passwordChecker.title')}</h1>
        <div className="glass-panel p-8">
          <div className="flex gap-4 items-center">
            <input
              className="glass-input flex-1"
              placeholder={t('passwordChecker.placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="text"
            />
            <button
              onClick={copyPassword}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition border border-white/10"
            >
              {copied ? t('common.copied') : "📋"}
            </button>
            <button
              onClick={() => setPassword("demo-compromised")}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition border border-white/10 text-sm font-medium"
              title={t('common.demo')}
            >
              {t('common.demo')}
            </button>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={checkPassword}
              className="glass-button px-8 py-3 w-full md:w-auto"
            >
              {loading ? t('passwordChecker.checking') : t('passwordChecker.button')}
            </button>
            {result && !result.error && result.breached && (
              <button
                onClick={() => exportBreachReportPDF({ type: "password", query: "●●●●●", result })}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition border border-white/10 text-white"
              >
                {t('passwordChecker.exportPDF')}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('passwordChecker.generate')}</h3>
          <PasswordGenerator onGenerate={setPassword} />
        </div>
      </div>
      <div className="mt-8">
        {result && result.error && (
          <div className="glass-panel p-6 border border-red-500/30 bg-red-500/10">
            <div className="text-red-400 font-bold mb-1">{t('error.title')}</div>
            <div className="text-gray-200">{result.message}</div>
          </div>
        )}
        {result && !result.error && result.breached && (
          <div className="glass-panel p-6 border border-red-500/30 bg-red-500/5 animate-slideUp">
            <div className="font-bold text-2xl text-red-400 mb-2">{t('passwordChecker.breachedTitle')}</div>
            <div className="text-gray-200 mb-4">{t('passwordChecker.breachedDesc', { count: result.count?.toLocaleString() })}</div>
            {renderTips()}
          </div>
        )}
        {result && !result.error && !result.breached && (
          <div className="glass-panel p-6 border border-green-500/30 bg-green-500/5 animate-slideUp">
            <div className="font-bold text-2xl text-green-400 mb-2">{t('passwordChecker.notFoundTitle')}</div>
            <div className="text-gray-200 mb-4">{t('passwordChecker.notFoundDesc')}</div>
            {renderTips()}
          </div>
        )}
      </div>
    </div>

  );
}
