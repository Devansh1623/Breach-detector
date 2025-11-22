import React from "react";
import { getStrengthColor, getStrengthLabel } from "../utils/strength";

export default function PasswordStrengthBar({ score }) {
  const color = getStrengthColor(score);
  const label = getStrengthLabel(score);

  return (
    <div className="mt-4">
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 transition-all ${color}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-100 mt-2">{label}</p>
    </div>
  );
}
