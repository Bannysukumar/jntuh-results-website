import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE = "https://jntuhresults.dhethi.com/api";
const PROXY_CACHE_TTL_SEC = 120; // 2 minutes for result cache
const NOTIFICATIONS_CACHE_TTL_SEC = 90; // 90 sec for notifications
const CACHEABLE_ENDPOINTS = ["getAcademicResult", "getAllResult", "getBacklogs", "getCreditsChecker", "getClassResults", "notifications"];

function getProxyCacheKey(endpoint: string, searchParams: URLSearchParams): string | null {
  if (endpoint === "notifications") {
    const page = searchParams.get("page") ?? "1";
    const degree = searchParams.get("degree") ?? "";
    const regulation = searchParams.get("regulation") ?? "";
    const title = searchParams.get("title") ?? "";
    const year = searchParams.get("year") ?? "";
    return `proxy:notifications:${page}:${degree}:${regulation}:${title}:${year}`;
  }
  if (!CACHEABLE_ENDPOINTS.includes(endpoint)) return null;
  const rollNumber = searchParams.get("rollNumber")?.trim().toUpperCase();
  if (!rollNumber || rollNumber.length < 10) return null;
  return `proxy:${endpoint}:${rollNumber}`;
}

async function getRedis(): Promise<import("ioredis").Redis | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  try {
    const Redis = (await import("ioredis")).default;
    return new Redis(url);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json(
      { error: "Endpoint parameter is required" },
      { status: 400 }
    );
  }

  const cacheKey = getProxyCacheKey(endpoint, searchParams);
  if (cacheKey) {
    try {
      const redis = await getRedis();
      if (redis) {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const data = JSON.parse(cached);
          return NextResponse.json(data, {
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
              "X-Proxy-Cache": "HIT",
            },
          });
        }
      }
    } catch {
      // ignore cache errors, proceed to fetch
    }
  }

  // Build the external API URL with all query parameters
  const externalUrl = new URL(`${EXTERNAL_API_BASE}/${endpoint}`);
  searchParams.forEach((value, key) => {
    if (key !== "endpoint") {
      externalUrl.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(externalUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      // Try to get error details from the response
      let errorData;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          try {
            errorData = JSON.parse(text);
          } catch {
            errorData = { error: text || `External API returned ${response.status}` };
          }
        }
      } catch {
        errorData = { error: `External API returned ${response.status}` };
      }
      
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: "Invalid JSON response", raw: text };
      }
    }

    // Cache successful responses for cacheable endpoints
    if (cacheKey && response.status === 200 && data && typeof data === "object") {
      const isResult = "details" in data;
      const isNotifications = endpoint === "notifications" && (Array.isArray(data) || (data as any).results != null);
      if (isResult || isNotifications) {
        try {
          const redis = await getRedis();
          if (redis) {
            const ttl = endpoint === "notifications" ? NOTIFICATIONS_CACHE_TTL_SEC : PROXY_CACHE_TTL_SEC;
            await redis.set(cacheKey, JSON.stringify(data), "EX", ttl);
          }
        } catch {
          // ignore
        }
      }
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from external API", message: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

