import React from "react";
import Navbar from "./Navbar";

export default function Terms() {
    return (
        <div className="min-h-screen text-white page-fade font-sans">
            <Navbar />

            <div className="max-w-4xl mx-auto pt-32 p-6">
                <h1 className="text-4xl font-bold mb-6 text-center text-white">Terms of Service</h1>

                <div className="glass-panel p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">1. Acceptance of Terms</h2>
                        <p className="text-gray-200 leading-relaxed">
                            By accessing and using BreachDetector, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">2. Service Description</h2>
                        <p className="text-gray-200 leading-relaxed">
                            BreachDetector provides security tools including email breach checking, password strength analysis, URL safety scanning, and IP privacy analysis. Our services are provided "as is" for informational purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">3. User Responsibilities</h2>
                        <p className="text-gray-200 leading-relaxed">
                            You agree to use our services only for lawful purposes. You must not use our tools to scan or analyze data you do not have permission to access. You are responsible for maintaining the confidentiality of your account credentials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">4. Limitations of Liability</h2>
                        <p className="text-gray-200 leading-relaxed">
                            While we strive for accuracy, BreachDetector does not guarantee that all breaches will be detected or that our analysis is 100% accurate. We are not liable for any damages resulting from the use or inability to use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">5. Intellectual Property</h2>
                        <p className="text-gray-200 leading-relaxed">
                            All content, features, and functionality of BreachDetector are owned by us and are protected by copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">6. Termination</h2>
                        <p className="text-gray-200 leading-relaxed">
                            We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">7. Changes to Terms</h2>
                        <p className="text-gray-200 leading-relaxed">
                            We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-3">8. Contact</h2>
                        <p className="text-gray-200 leading-relaxed">
                            For questions about these Terms of Service, please contact us at <a href="mailto:devanshgeria18@gmail.com" className="text-purple-400 hover:text-purple-300 underline">devanshgeria18@gmail.com</a>.
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
