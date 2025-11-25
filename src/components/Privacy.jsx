import React from "react";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";

export default function Privacy() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen text-white font-sans">
            <Navbar />

            <div className="max-w-4xl mx-auto pt-32 p-6">
                <h1 className="text-4xl font-bold mb-6 text-center text-white">{t('privacy.title')}</h1>

                <div className="glass-panel p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('privacy.sections.1.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('privacy.sections.1.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('privacy.sections.2.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('privacy.sections.2.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('privacy.sections.3.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('privacy.sections.3.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('privacy.sections.4.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('privacy.sections.4.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('privacy.sections.5.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('privacy.sections.5.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('privacy.sections.6.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('privacy.sections.6.content')}
                        </p>
                    </section>

                    <div className="pt-6 border-t border-white/10 text-sm text-gray-400">
                        {t('privacy.lastUpdated')} {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
