import React from "react";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";

export default function Terms() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen text-white font-sans">
            <Navbar />

            <div className="max-w-4xl mx-auto pt-32 p-6">
                <h1 className="text-4xl font-bold mb-6 text-center text-white">{t('terms.title')}</h1>

                <div className="glass-panel p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('terms.sections.1.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('terms.sections.1.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('terms.sections.2.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('terms.sections.2.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('terms.sections.3.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('terms.sections.3.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('terms.sections.4.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('terms.sections.4.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('terms.sections.5.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('terms.sections.5.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('terms.sections.6.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('terms.sections.6.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('terms.sections.7.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('terms.sections.7.content')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">{t('terms.sections.8.title')}</h2>
                        <p className="text-gray-200 leading-relaxed">
                            {t('terms.sections.8.content')}
                        </p>
                    </section>

                    <div className="pt-6 border-t border-white/10 text-sm text-gray-400">
                        {t('terms.lastUpdated')} {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
