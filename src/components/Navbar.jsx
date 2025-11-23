import React, { useState } from "react";
import { Link } from "react-router-dom";
import HistoryModal from "./HistoryModal";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [showHistory, setShowHistory] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = React.useNavigate ? React.useNavigate() : null; // Safe check if used outside Router context, though Navbar is inside Router

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login"; // Force reload/redirect
  };

  const navLinks = [
    { to: "/", label: t('nav.home') },
    { to: "/email-check", label: t('nav.email') },
    { to: "/password-check", label: t('nav.password') },
    { to: "/url-check", label: t('nav.url') },
    { to: "/ip-scan", label: t('nav.ip') },
    { to: "/owasp-scan", label: t('nav.owasp') },
  ];

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 glass-nav">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-purple-500">🛡️</span> Breach Detector
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setShowHistory(true)}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              📜 History
            </button>
            <LanguageSelector />
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded transition-colors border border-red-500/30"
            >
              {t('nav.logout')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl focus:outline-none"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10">
            <div className="flex flex-col px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setShowHistory(true);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-left"
              >
                📜 History
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded transition-colors text-left border border-red-500/30"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        )}
      </nav>

      <HistoryModal open={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
}
