import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

async function verifyAdmin(request: NextRequest): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isAdmin: false, error: "Missing authorization header" };
    }

    const idToken = authHeader.split("Bearer ")[1];
    const { verifyAdminUser } = await import("@/lib/admin-auth");
    const isAdmin = await verifyAdminUser(idToken);
    
    return { isAdmin, error: isAdmin ? undefined : "Unauthorized" };
  } catch (error: any) {
    console.error("Error verifying admin:", error);
    return { isAdmin: false, error: error.message || "Unauthorized" };
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

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch notification logs, ordered by most recent first
    const logsSnapshot = await adminDb
      .collection("notificationLogs")
      .orderBy("sentAt", "desc")
      .limit(limit)
      .offset(offset)
      .get();

    const notifications = logsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        body: data.body,
        url: data.url || null,
        totalSubscriptions: data.totalSubscriptions || 0,
        successful: data.successful || 0,
        failed: data.failed || 0,
        sentAt: data.sentAt?.toDate?.()?.toISOString() || data.sentAt,
      };
    });

    // Get total count
    const totalSnapshot = await adminDb
      .collection("notificationLogs")
      .get();
    const total = totalSnapshot.size;

    return NextResponse.json({
      success: true,
      notifications,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching notification history:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notification history" },
      { status: 500 }
    );
  }
}

