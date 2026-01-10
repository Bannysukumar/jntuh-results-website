import { NextRequest, NextResponse } from "next/server";
import { verifyAdminUser } from "@/lib/admin-auth";
import { adminDb } from "@/lib/firebase-admin";

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

    // Get all banned users from Firestore
    const bannedUsersSnapshot = await adminDb.collection("bannedUsers").get();

    const users: Array<{
      deviceId: string;
      reason: string;
      bannedAt: number;
      bannedBy: string;
    }> = [];

    bannedUsersSnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        deviceId: doc.id,
        reason: data.reason || "Violation",
        bannedAt: data.bannedAt || Date.now(),
        bannedBy: data.bannedBy || "admin",
      });
    });

    // Sort by banned date (newest first)
    users.sort((a, b) => b.bannedAt - a.bannedAt);

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error: any) {
    console.error("Error fetching banned users:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch banned users",
        users: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}

