import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

let redisUrl: string = String(process.env.REDIS_URL);
let redis = new Redis(redisUrl);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const htno = searchParams.get("htno");

  try {
    if (htno) {
      // Clear specific hall ticket number cache
      const deleted = await redis.del(htno.toUpperCase());
      
      if (deleted > 0) {
        return NextResponse.json(
          {
            success: true,
            message: `Cache cleared for hall ticket number: ${htno.toUpperCase()}`,
            deleted: deleted,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: `No cache found for hall ticket number: ${htno.toUpperCase()}`,
          },
          { status: 404 }
        );
      }
    } else {
      // Clear all result caches (but keep notifications)
      const keys = await redis.keys("*");
      const resultKeys = keys.filter(
        (key) => key !== "notifications" && key.length === 10
      );
      
      if (resultKeys.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "No result caches found to clear",
          },
          { status: 404 }
        );
      }

      const deleted = await redis.del(...resultKeys);

      return NextResponse.json(
        {
          success: true,
          message: `Cleared ${deleted} result cache entries`,
          deleted: deleted,
          totalKeys: resultKeys.length,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Hard refresh error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear cache",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { htno, clearAll } = body;

    if (clearAll) {
      // Clear all result caches
      const keys = await redis.keys("*");
      const resultKeys = keys.filter(
        (key) => key !== "notifications" && key.length === 10
      );

      if (resultKeys.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "No result caches found to clear",
          },
          { status: 404 }
        );
      }

      const deleted = await redis.del(...resultKeys);

      return NextResponse.json(
        {
          success: true,
          message: `Cleared ${deleted} result cache entries`,
          deleted: deleted,
          totalKeys: resultKeys.length,
        },
        { status: 200 }
      );
    } else if (htno) {
      // Clear specific hall ticket number cache
      const deleted = await redis.del(htno.toUpperCase());

      if (deleted > 0) {
        return NextResponse.json(
          {
            success: true,
            message: `Cache cleared for hall ticket number: ${htno.toUpperCase()}`,
            deleted: deleted,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: `No cache found for hall ticket number: ${htno.toUpperCase()}`,
          },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Either 'htno' or 'clearAll' parameter is required",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Hard refresh error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear cache",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

