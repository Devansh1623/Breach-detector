import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import HistoryModal from "./HistoryModal";

export default function Navbar() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
     <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-md 
  bg-black/30 dark:bg-white/40 border-b border-white/10 dark:border-black/10">

        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-white">
             Breach Detector
          </Link>

          <div className="flex gap-4 items-center">
            <Link to="/email" className="hover:text-purple-400">Email</Link>
            <Link to="/password" className="hover:text-purple-400">Password</Link>
            <Link to="/check-url" className="hover:text-purple-400">URL Checker</Link>
            <button onClick={() => setShowHistory(true)} className="px-3 py-2 bg-white/6 rounded">📜 History</button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <HistoryModal open={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
}
