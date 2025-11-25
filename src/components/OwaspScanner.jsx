import React, { useState } from "react";
import Navbar from "./Navbar";
import { addHistory } from "../utils/history";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { post } from "../utils/api";

export default function OwaspScanner() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [error, setError] = useState("");

    const handleScan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            // Ensure URL has protocol
            let targetUrl = url;
            if (!targetUrl.startsWith("http")) {
                targetUrl = "https://" + targetUrl;
            }

            const data = await post("/scan-owasp", { url: targetUrl });

            if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("Failed to connect to the scanner service.");
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (grade) => {
        if (grade === "A") return "text-green-400";
        if (grade === "B") return "text-blue-400";
        if (grade === "C") return "text-yellow-400";
        if (grade === "D") return "text-orange-400";
        return "text-red-500";
    };

    return (
        <div className="min-h-screen text-white font-sans">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-32 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-bold mb-4 text-white">
                        {t('owaspScanner.title')}
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        {t('owaspScanner.subtitle')}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-panel p-8"
                >
                    <form onSubmit={handleScan} className="mb-8">
                        <div className="flex flex-col gap-6">
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    placeholder={t('owaspScanner.placeholder')}
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="glass-input w-full pl-6 pr-20"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            const text = await navigator.clipboard.readText();
                                            setUrl(text);
                                        } catch (err) {
                                            console.error('Failed to read clipboard');
                                        }
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm text-gray-300 hover:text-white transition-colors backdrop-blur-md border border-white/5"
                                >
                                    {t('common.paste')}
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="glass-button w-full py-3 text-lg font-bold tracking-wide uppercase"
                            >
                                {loading ? t('owaspScanner.scanning') : t('owaspScanner.button')}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 mb-6">
                            {error}
                        </div>
                    )}

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Score Card */}
                            <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-gray-300 uppercase tracking-widest text-sm mb-2">{t('owaspScanner.grade')}</p>
                                <div className={`text-8xl font-bold mb-2 ${getGradeColor(result.grade)} text-glow`}>
                                    {result.grade}
                                </div>
                                <p className="text-2xl font-semibold">{t('owaspScanner.score')}: {result.score}/100</p>
                            </div>

                            {/* Findings */}
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">{t('owaspScanner.findings')}</h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement("a");
                                                a.href = url;
                                                a.download = `owasp-scan-${new Date().toISOString().slice(0, 10)}.json`;
                                                a.click();
                                            }}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                                        >
                                            {t('owaspScanner.exportJSON')}
                                        </button>
                                        <button
                                            onClick={() => window.print()}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-colors"
                                        >
                                            {t('owaspScanner.printPDF')}
                                        </button>
                                    </div>
                                </div>

                                {result.findings.length === 0 ? (
                                    <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-4">
                                        <div className="text-3xl">✅</div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-green-400">{t('owaspScanner.noIssues')}</h4>
                                            <p className="text-gray-300">{t('owaspScanner.noIssuesDesc')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {result.findings.map((item, index) => (
                                            <FindingItem key={index} item={item} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function FindingItem({ item }) {
    const [expanded, setExpanded] = useState(false);
    const { t } = useTranslation();

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition group cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <div className="text-2xl mt-1">
                    {item.severity === "critical" && "🚨"}
                    {item.severity === "high" && "🔴"}
                    {item.severity === "medium" && "🟠"}
                    {item.severity === "low" && "🟡"}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold capitalize text-white mb-1">{item.message}</h4>
                        <span className="text-gray-200 text-xl transform transition-transform duration-200" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            ▼
                        </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded uppercase tracking-wider font-semibold ${item.severity === "critical" ? "bg-red-500/20 text-red-300" :
                        item.severity === "high" ? "bg-red-500/20 text-red-300" :
                            item.severity === "medium" ? "bg-orange-500/20 text-orange-300" :
                                "bg-yellow-500/20 text-yellow-300"
                        }`}>
                        {t('owaspScanner.severityLabel', { level: item.severity })}
                    </span>

                    {expanded && item.remediation && (
                        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/5">
                            <p className="text-sm text-gray-300 leading-relaxed">{item.remediation}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
