import { NextRequest, NextResponse } from "next/server";
import { verifyAdminUser } from "@/lib/admin-auth";
import { getDatabase } from "firebase-admin/database";
import { adminApp } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

async function verifyAdmin(request: NextRequest): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isAdmin: false, error: "Authorization header required" };
    }

    const idToken = authHeader.substring(7);
    const isAdmin = await verifyAdminUser(idToken);
    return { isAdmin };
  } catch (error: any) {
    return { isAdmin: false, error: error.message };
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Get Realtime Database reference
    if (!adminApp) {
      console.error("Admin app is not initialized");
      return NextResponse.json(
        {
          error: "Firebase Admin app not initialized",
          users: [],
          count: 0,
        },
        { status: 500 }
      );
    }
    
    try {
      // Get database instance (databaseURL is already set in firebase-admin.ts initialization)
      const db = getDatabase(adminApp);
      
      const presenceRef = db.ref("presence");

      // Get all online users
      const snapshot = await presenceRef.once("value");
      const data = snapshot.val();

      const users: Array<{ sessionId: string; username: string; deviceId: string; lastSeen: number }> = [];
      if (data) {
        Object.entries(data).forEach(([sessionId, value]: [string, any]) => {
          users.push({
            sessionId,
            username: value.username || "Unknown",
            deviceId: value.deviceId || "unknown",
            lastSeen: value.lastSeen || Date.now(),
          });
        });
      }

      return NextResponse.json({
        success: true,
        users,
        count: users.length,
      });
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      console.error("Error details:", {
        message: dbError.message,
        code: dbError.code,
        stack: dbError.stack,
      });
      // Return empty users if database access fails
      return NextResponse.json({
        success: true,
        users: [],
        count: 0,
        error: dbError.message || "Could not access Realtime Database. Make sure it's enabled and configured with databaseURL.",
      });
    }
  } catch (error: any) {
    console.error("Error fetching active users:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch active users",
        users: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}

