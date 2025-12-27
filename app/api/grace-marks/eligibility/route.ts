import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE = "https://jntuhresults.dhethi.com/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rollNumber = searchParams.get("rollNumber");

  if (!rollNumber) {
    return NextResponse.json(
      { error: "rollNumber parameter is required" },
      { status: 400 }
    );
  }

  // Build the external API URL
  const externalUrl = new URL(`${EXTERNAL_API_BASE}/grace-marks/eligibility`);
  externalUrl.searchParams.append("rollNumber", rollNumber);

  try {
    const response = await fetch(externalUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
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

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error: any) {
    console.error("Grace marks eligibility error:", error);
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

