import React from "react";
import Navbar from "./Navbar";

export default function Privacy() {
    return (
        <div className="min-h-screen text-white page-fade font-sans">
            <Navbar />

            <div className="max-w-4xl mx-auto pt-32 p-6">
                <h1 className="text-4xl font-bold mb-6 text-center text-white">Privacy Policy</h1>

                <div className="glass-panel p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">1. Information We Collect</h2>
                        <p className="text-gray-200 leading-relaxed">
                            We collect information you provide directly to us, including email addresses for account creation and scan queries (emails, passwords, URLs) for security analysis. We do not store passwords in plain text.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">2. How We Use Your Information</h2>
                        <p className="text-gray-200 leading-relaxed">
                            Your information is used to provide breach detection services, improve our security tools, and communicate important updates. We analyze your queries against known breach databases to provide security insights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">3. Data Storage</h2>
                        <p className="text-gray-200 leading-relaxed">
                            Scan history is stored locally in your browser using LocalStorage. User accounts are stored securely in our database with encrypted passwords. We do not share your data with third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">4. Security</h2>
                        <p className="text-gray-200 leading-relaxed">
                            We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure. We recommend using strong, unique passwords for your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">5. Your Rights</h2>
                        <p className="text-gray-200 leading-relaxed">
                            You have the right to access, update, or delete your personal information at any time. Contact us at <a href="mailto:devanshgeria18@gmail.com" className="text-purple-400 hover:text-purple-300 underline">devanshgeria18@gmail.com</a> for any privacy-related requests.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">6. Changes to This Policy</h2>
                        <p className="text-gray-200 leading-relaxed">
                            We may update this privacy policy from time to time. We will notify users of any significant changes by posting the new policy on this page.
                        </p>
                    </section>

                    <div className="pt-6 border-t border-white/10 text-sm text-gray-400">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
