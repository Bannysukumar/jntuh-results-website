import { NextRequest, NextResponse } from "next/server";
import { verifyAdminUser } from "@/lib/admin-auth";
import { adminDb } from "@/lib/firebase-admin";

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

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { deviceId, reason } = body;

    if (!deviceId || !deviceId.trim()) {
      return NextResponse.json(
        { error: "Device ID is required" },
        { status: 400 }
      );
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Ban reason is required" },
        { status: 400 }
      );
    }

    // Ban the user by adding to bannedUsers collection
    await adminDb.collection("bannedUsers").doc(deviceId.trim()).set({
      reason: reason.trim(),
      bannedAt: Date.now(),
      bannedBy: "admin",
    });

    return NextResponse.json({
      success: true,
      message: `User ${deviceId} has been banned`,
    });
  } catch (error: any) {
    console.error("Error banning user:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to ban user",
        success: false,
      },
      { status: 500 }
    );
  }
}

