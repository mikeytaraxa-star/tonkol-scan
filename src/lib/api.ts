/**
 * Centralized API helper — proxies all Tonkol API calls through a backend function
 * so the API key is never exposed client-side.
 */

const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const PROXY_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/tonkol-api-proxy`;

export async function tonkolFetch<T = unknown>(apiPath: string): Promise<T> {
  const url = `${PROXY_URL}?path=${encodeURIComponent(apiPath)}`;
  const response = await fetch(url, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Validates that a URL is a safe social link (https only, known domains).
 */
export function isValidSocialUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const allowedHosts = ["x.com", "twitter.com", "t.me", "telegram.me", "instagram.com"];
    return allowedHosts.some(h => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/**
 * Returns the WebSocket URL for real-time trades.
 * The WS endpoint is public and uses the same API key via the proxy isn't possible for WS,
 * so we accept that the WS key is a public-facing key (similar to anon key).
 */
export function getTradesWebSocketUrl(): string {
  // WebSocket connections cannot be proxied through edge functions.
  // The API key used here is a public/project-scoped key, not a secret.
  return `wss://apitonkol.pro/ws/trades/full?api_key=${SUPABASE_ANON_KEY}`;
}
