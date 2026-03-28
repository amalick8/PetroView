import { auth } from "@clerk/nextjs/server";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const isDemoMode =
  process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function fetchWithAuth(path: string, init: RequestInit = {}) {
  if (isDemoMode) {
    return fetch(`${baseUrl}${path}`, init);
  }

  const { getToken } = auth();
  const token = await getToken();

  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${baseUrl}${path}`, { ...init, headers });
}
