const KEY = "breach_history_v2";

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHistory(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function addHistory(entry) {
  const arr = loadHistory();
  arr.unshift(entry);
  if (arr.length > 200) arr.pop();
  saveHistory(arr);
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
