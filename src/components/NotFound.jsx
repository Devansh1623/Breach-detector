import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080616] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold neon">404</h1>
        <p className="text-xl mt-3">Page not found</p>
        <div className="mt-6">
          <Link to="/" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
