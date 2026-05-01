const apiBaseUrl = import.meta.env.VITE_API_URL;

if (!apiBaseUrl) {
  throw new Error("Missing VITE_API_URL. Add it to harmony-workspace/.env");
}

const API_URL = apiBaseUrl.replace(/\/$/, "");

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `API request failed with ${response.status}`);
  }

  return data as T;
}

export { API_URL };
