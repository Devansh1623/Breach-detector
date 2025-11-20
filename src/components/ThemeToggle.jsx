import React, { useEffect, useState } from "react";

const THEME_KEY = "theme_mode";

function getSaved() {
  const s = localStorage.getItem(THEME_KEY);
  return s ? s : "dark";
}

export default function ThemeToggle() {
  const [mode, setMode] = useState(getSaved());

  useEffect(() => {
    if (mode === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  useEffect(() => {
    // initialize at mount
    const saved = getSaved();
    setMode(saved);
  }, []);

  return (
    <button
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
    >
      {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
