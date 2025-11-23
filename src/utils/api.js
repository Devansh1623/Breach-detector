export const BASE = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_BASE || "http://127.0.0.1:3000");

console.log("API BASE URL:", BASE || "Relative Path (Same Origin)");

export async function post(path, body) {
  const url = `${BASE}${path}`;
  console.log(`[API] POST request to: ${url}`);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`[API] Error ${res.status}:`, data);
      const err = new Error(data.message || "Request failed");
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`[API] Network/Server Error:`, error);
    throw error;
  }
}
