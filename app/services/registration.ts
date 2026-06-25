export const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api";

if (!BASE_URL) throw new Error("VITE_API_BASE_URL is not set");

export async function joinWaitlist(email: string) {
  const res = await fetch(`${BASE_URL}/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Failed to join waitlist");

  return res.json();
}

export async function getCount() {
  const res = await fetch(`${BASE_URL}/count`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to retrieve count");

  return res.json();
}