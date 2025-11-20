export function calculateStrength(password) {
  let score = 0;

  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;

  return Math.min(score, 100);
}

export function getStrengthLabel(score) {
  if (score < 30) return "Very Weak";
  if (score < 50) return "Weak";
  if (score < 70) return "Moderate";
  if (score < 90) return "Strong";
  return "Very Strong";
}

export function getStrengthColor(score) {
  if (score < 30) return "bg-red-600";
  if (score < 50) return "bg-orange-500";
  if (score < 70) return "bg-yellow-400";
  if (score < 90) return "bg-green-500";
  return "bg-green-700";
}
