import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function IpScanner() {
    const { t } = useTranslation();
    const [ipData, setIpData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIpData = async () => {
            try {
                const response = await fetch("https://ipapi.co/json/");
                if (!response.ok) {
                    throw new Error(t('ipScanner.error'));
                }
                const data = await response.json();
                setIpData(data);
            } catch (err) {
                setError(t('ipScanner.error'));
            } finally {
                setLoading(false);
            }
        };
        fetchIpData();
    }, []);

    return (
        <div className="min-h-screen text-white font-sans">
            <Navbar />
            <div className="max-w-2xl mx-auto pt-32 p-6">
                <h1 className="text-4xl font-bold mb-6 text-center text-white">{t('ipScanner.title')}</h1>
                <p className="text-center text-gray-200 mb-8">{t('ipScanner.subtitle')}</p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel p-8"
                >
                    {loading && (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                            <p className="text-gray-200">{t('ipScanner.loading')}</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center py-10 text-red-400">
                            <p>{error}</p>
                        </div>
                    )}
                    {ipData && !loading && !error && (
                        <div className="space-y-6">
                            <div className="text-center border-b border-white/10 pb-6">
                                <p className="text-sm text-gray-200 uppercase tracking-wider mb-2">{t('ipScanner.yourIP')}</p>
                                <h2 className="text-3xl md:text-5xl font-mono font-bold text-white text-glow break-all">{ipData.ip}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                    <p className="text-sm text-gray-200 mb-1">{t('ipScanner.location')}</p>
                                    <p className="text-lg font-semibold">{ipData.city}, {ipData.region}, {ipData.country_name}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                    <p className="text-sm text-gray-200 mb-1">{t('ipScanner.isp')}</p>
                                    <p className="text-lg font-semibold">{ipData.org}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                    <p className="text-sm text-gray-200 mb-1">{t('ipScanner.timezone')}</p>
                                    <p className="text-lg font-semibold">{ipData.timezone}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                    <p className="text-sm text-gray-200 mb-1">{t('ipScanner.coordinates')}</p>
                                    <p className="text-lg font-semibold">{ipData.latitude}, {ipData.longitude}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
