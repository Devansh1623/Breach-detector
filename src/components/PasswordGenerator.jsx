import React from "react";

export default function PasswordGenerator({ onGenerate }) {
  function generatePassword() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>?/";
    let pass = "";
    for (let i = 0; i < 14; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    onGenerate(pass);
  }

  return (
    <button
      onClick={generatePassword}
      className="px-4 py-2 bg-gray-700 hover:bg-gray-800 transition rounded-lg text-white mt-4"
    >
      🔐 Generate Strong Password
    </button>
  );
}
