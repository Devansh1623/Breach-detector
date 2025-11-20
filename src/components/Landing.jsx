import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#080616] text-white dark:bg-white dark:text-black page-fade">


      <Navbar />

      <div className="max-w-4xl mx-auto text-center pt-40 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold"
        >
          Protect Your Accounts From Data Breaches
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-gray-300 text-lg"
        >
          Check if your email or password has been leaked — instantly, accurately, securely.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">

  {/* A1 – Email Checker */}
  <div className="info-card">
    <h2 className="text-2xl font-semibold mb-3">Email Breach Checker</h2>
    <p className="text-gray-300 mb-5">
      Instantly check if your email appears in known data breaches.
      Stay ahead of attackers by monitoring exposure.
    </p>
    <a href="/email" className="info-btn">
      Check Email
    </a>
  </div>

  {/* A2 – Password Checker */}
  <div className="info-card">
    <h2 className="text-2xl font-semibold mb-3">Password Leak Scanner</h2>
    <p className="text-gray-300 mb-5">
      Test your password against millions of leaked credentials using
      the powerful HIBP hash-range API.
    </p>
    <a href="/password" className="info-btn">
      Check Password
    </a>
  </div>

  {/* A3 – URL Safety Scanner */}
  <div className="info-card">
    <h2 className="text-2xl font-semibold mb-3">URL Phishing Scanner</h2>
    <p className="text-gray-300 mb-5">
      Detect unsafe websites using heuristic analysis — HTTPS, punycode,
      shorteners, domain age & more.
    </p>
    <a href="/check-url" className="info-btn">
      Scan URL
    </a>
  </div>

</div>

          
        </motion.div>
      </div>
    </div>
    
  );
}
