const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function fetchPublic(path: string, init: RequestInit = {}) {
  return fetch(`${baseUrl}${path}`, init);
}

export async function fetchWithAuth(path: string, init: RequestInit = {}) {
  return fetchPublic(path, init);
}
