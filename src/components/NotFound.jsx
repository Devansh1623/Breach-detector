import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="glass-panel p-12 text-center max-w-2xl">
          <div className="text-9xl font-bold text-glow mb-4">404</div>
          <h1 className="text-3xl font-bold mb-4">{t('notFound.title')}</h1>
          <p className="text-gray-300 mb-8">
            {t('notFound.desc')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link to="/" className="glass-button py-3 text-sm">
              🏠 {t('notFound.home')}
            </Link>
            <Link to="/email-check" className="glass-button py-3 text-sm">
              📧 {t('nav.email')}
            </Link>
            <Link to="/password-check" className="glass-button py-3 text-sm">
              🔒 {t('nav.password')}
            </Link>
            <Link to="/url-check" className="glass-button py-3 text-sm">
              🔗 {t('nav.url')}
            </Link>
          </div>

          <Link to="/" className="text-purple-400 hover:text-purple-300 transition underline">
            ← {t('notFound.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
