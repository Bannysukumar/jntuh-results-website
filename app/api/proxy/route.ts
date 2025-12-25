import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE = "https://jntuhresults.dhethi.com/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json(
      { error: "Endpoint parameter is required" },
      { status: 400 }
    );
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
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API returned ${response.status}` },
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

    // Return the response with CORS headers
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

