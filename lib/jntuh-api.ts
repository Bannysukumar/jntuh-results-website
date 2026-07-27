/**
 * Upstream JNTUH results API (same backend used by jntuhconnect.dhethi.com).
 * Requires X-Api-Key on requests to jntuhresults.dhethi.com.
 */
export const JNTUH_API_BASE_URL =
  process.env.JNTUH_API_BASE_URL?.replace(/\/$/, "") ||
  "https://jntuhresults.dhethi.com/api";

/** Public client key (also embedded in jntuhconnect frontend). Override via env on server. */
export const JNTUH_API_KEY =
  process.env.JNTUH_API_KEY || process.env.NEXT_PUBLIC_JNTUH_API_KEY || "kanipinchinda";

export const JNTUH_API_KEY_HEADER = "X-Api-Key";

export function getJntuhApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json",
  };
  if (JNTUH_API_KEY) {
    headers[JNTUH_API_KEY_HEADER] = JNTUH_API_KEY;
  }
  return headers;
}

export function buildJntuhApiUrl(path: string, params?: Record<string, string>): string {
  const base = JNTUH_API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(`${base}/${normalizedPath}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, value);
    });
  }
  return url.toString();
}
