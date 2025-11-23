export const BASE = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_BASE || "http://127.0.0.1:3000");

export async function post(path, body) {
  console.log(`POST request to: ${BASE}${path}`);
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
