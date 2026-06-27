export const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api";
const API_KEY = import.meta.env.VITE_xage47282;

if (!BASE_URL) throw new Error("VITE_API_BASE_URL is not set");

export async function joinWaitlist(email: string) {
  const res = await fetch(`${BASE_URL}/waitlist`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ email }),
  });

  const text = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    // response wasn't JSON (e.g. plain text from middleware)
  }

  if (!res.ok) throw new Error(data.error ?? text ?? "Failed to join waitlist");

  return data;
}

export async function getCount() {
  const res = await fetch(`${BASE_URL}/count`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
  });

  if (!res.ok) throw new Error("Failed to retrieve count");

  return res.json();
}