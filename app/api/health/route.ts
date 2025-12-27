import { NextResponse } from "next/server";

export async function GET() {
  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        api: "operational",
        database: "operational", // You can add actual database health checks here
        redis: "operational", // You can add actual Redis health checks here
      },
    };

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

