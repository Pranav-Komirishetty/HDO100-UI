//const BASE_URL = "http://192.168.29.69:4000"; //winnie
//const BASE_URL = "http://192.168.0.141:4000"; //tuffy
//const BASE_URL = "http://192.168.137.1:4000"; //s24
const BASE_URL = import.meta.env.VITE_API_URL

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
}
