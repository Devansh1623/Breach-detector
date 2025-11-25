import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center pt-40 px-6 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold animated-gradient mb-6 leading-tight"
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-gray-100 text-xl max-w-2xl mx-auto"
        >
          {t('hero.subtitle')}
        </motion.p>
      </div>

      {/* Why Security Matters Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="glass-panel py-20"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">{t('whySecurity.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-6xl mb-6">🔓</div>
              <h3 className="text-xl font-semibold mb-4 text-purple-300">{t('whySecurity.billions.title')}</h3>
              <p className="text-gray-100 leading-relaxed">
                {t('whySecurity.billions.desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">💸</div>
              <h3 className="text-xl font-semibold mb-4 text-purple-300">{t('whySecurity.financial.title')}</h3>
              <p className="text-gray-100 leading-relaxed">
                {t('whySecurity.financial.desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">🛡️</div>
              <h3 className="text-xl font-semibold mb-4 text-purple-300">{t('whySecurity.proactive.title')}</h3>
              <p className="text-gray-100 leading-relaxed">
                {t('whySecurity.proactive.desc')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Your Data Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white">{t('dataSecurity.title')}</h2>
        <p className="text-center text-gray-100 max-w-3xl mx-auto mb-8 text-lg">
          {t('dataSecurity.subtitle')}
        </p>

        {/* Scroll to Services Button */}
        <div className="text-center mb-16">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => {
              document.getElementById('services-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-semibold transition-all text-white shadow-lg hover:shadow-purple-500/50 text-lg"
          >
            {t('dataSecurity.useServices')} ↓
          </motion.button>
        </div>

        {/* Security Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel glass-card-hover p-6"
          >
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-3 text-purple-200">Zero Data Storage</h3>
            <p className="text-gray-100 leading-relaxed">
              We never store your passwords, emails, or sensitive data on our servers. All checks are performed in real-time and discarded immediately.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel glass-card-hover p-6"
          >
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-3 text-blue-200">Privacy-First Design</h3>
            <p className="text-gray-100 leading-relaxed">
              Password checks use k-Anonymity hashing. Your actual password never leaves your browser in plain text—only a partial hash is sent.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel glass-card-hover p-6"
          >
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-3 text-cyan-200">Transparent Operations</h3>
            <p className="text-gray-100 leading-relaxed">
              All breach checks use publicly available databases and APIs. No hidden tracking, no data mining, no third-party analytics.
            </p>
          </motion.div>
        </div>

        {/* How Each Service Protects Privacy */}
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">How Each Service Protects Your Privacy</h3>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel glass-card-hover p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">📧</div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Email Breach Checker</h4>
                <p className="text-gray-100 leading-relaxed">
                  Queries public breach databases like BreachDirectory. Your email is hashed before transmission and never stored on our servers. Results are displayed instantly and forgotten.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel glass-card-hover p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔑</div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Password Leak Scanner</h4>
                <p className="text-gray-100 leading-relaxed">
                  Uses <strong>k-Anonymity</strong> via Have I Been Pwned API. Your password is hashed locally (SHA-1), and only the first 5 characters of the hash are sent. The server returns all matching hashes, and your browser checks locally—your actual password never leaves your device.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel glass-card-hover p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔗</div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">URL Phishing Scanner</h4>
                <p className="text-gray-100 leading-relaxed">
                  Analyzes URLs for suspicious patterns, malicious domains, and phishing indicators. No URLs are logged or stored. Analysis happens in real-time and results are immediately discarded.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel glass-card-hover p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">🌐</div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">IP Privacy Scanner</h4>
                <p className="text-gray-100 leading-relaxed">
                  Makes read-only API calls to ipapi.co to show what information websites can see about your connection. No tracking, no logging, no data retention.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel glass-card-hover p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">🛡️</div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">OWASP Config Scanner</h4>
                <p className="text-gray-100 leading-relaxed">
                  Analyzes HTTP security headers only. No site content is accessed, stored, or logged. We only check publicly visible HTTP headers to identify missing security configurations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 glass-panel text-center"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">Our Commitment to You</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div>
              <div className="text-3xl mb-2">🌟</div>
              <p className="font-semibold mb-1">Open-Source Ready</p>
              <p className="text-sm">Transparency through code visibility</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🚫</div>
              <p className="font-semibold mb-1">No Third-Party Tracking</p>
              <p className="text-sm">No analytics, no cookies, no surveillance</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💻</div>
              <p className="font-semibold mb-1">Local-First Processing</p>
              <p className="text-sm">Sensitive operations happen on your device</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Services Section */}
      <div id="services-section" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Our Security Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Email Checker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel glass-card-hover p-8 text-center"
          >
            <div>
              <div className="text-4xl mb-6">📧</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Email Breach Checker</h3>
              <p className="text-gray-100 mb-8">
                Scan known data breaches to see if your email address has been compromised in major leaks.
              </p>
            </div>
            <Link
              to="/email-check"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg text-white"
            >
              Check Email
            </Link>
          </motion.div>

          {/* Password Checker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel glass-card-hover p-8 text-center"
          >
            <div>
              <div className="text-4xl mb-6">🔑</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Password Leak Scanner</h3>
              <p className="text-gray-100 mb-8">
                Securely test your passwords against a database of leaked credentials using k-Anonymity.
              </p>
            </div>
            <Link
              to="/password-check"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg text-white"
            >
              Check Password
            </Link>
          </motion.div>

          {/* URL Checker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel glass-card-hover p-8 text-center"
          >
            <div>
              <div className="text-4xl mb-6">🔗</div>
              <h3 className="text-2xl font-bold mb-4 text-white">URL Phishing Scanner</h3>
              <p className="text-gray-100 mb-8">
                Analyze URLs for phishing indicators, malicious domains, and suspicious patterns before you click.
              </p>
            </div>
            <Link
              to="/url-check"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg text-white"
            >
              Scan URL
            </Link>
          </motion.div>

          {/* IP Scanner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel glass-card-hover p-8 text-center"
          >
            <div>
              <div className="text-4xl mb-6">🌐</div>
              <h3 className="text-2xl font-bold mb-4 text-white">IP Privacy Scanner</h3>
              <p className="text-gray-100 mb-8">
                Check what your IP address reveals about your location, ISP, and connection privacy.
              </p>
            </div>
            <Link
              to="/ip-scan"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg text-white"
            >
              Scan IP
            </Link>
          </motion.div>

          {/* OWASP Scanner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel glass-card-hover p-8 text-center md:col-span-2 lg:col-span-4"
          >
            <div>
              <div className="text-4xl mb-6">🛡️</div>
              <h3 className="text-2xl font-bold mb-4 text-white">OWASP Config Scanner</h3>
              <p className="text-gray-100 mb-8">
                Scan your site for missing security headers, SSL issues, and OWASP misconfigurations.
              </p>
            </div>
            <Link
              to="/owasp-scan"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg text-white"
            >
              Scan Website
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
