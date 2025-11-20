export function getSavedTheme() {
  return localStorage.getItem("theme") || "dark";
}

export function applyTheme(mode) {
  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("theme", mode);
}
