import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

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

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, message, url, type, duration } = await request.json();

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { error: "Title must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 }
      );
    }

    // Validate duration (default to 30 seconds if not provided or invalid)
    const displayDuration = duration && duration >= 5 && duration <= 300 ? duration : 30;

    // Create real-time notification in Firestore
    const notificationData = {
      title: title.trim(),
      message: message.trim(),
      url: url?.trim() || null,
      type: type || "info",
      duration: displayDuration, // Duration in seconds
      createdAt: Timestamp.now(),
      sentBy: "admin",
    };

    const docRef = await adminDb
      .collection("realTimeNotifications")
      .add(notificationData);

    // Clean up old notifications (keep only last 50)
    const oldNotifications = await adminDb
      .collection("realTimeNotifications")
      .orderBy("createdAt", "desc")
      .offset(50)
      .get();

    const batch = adminDb.batch();
    oldNotifications.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Real-time notification sent successfully",
      notificationId: docRef.id,
    });
  } catch (error: any) {
    console.error("Error sending real-time notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send real-time notification" },
      { status: 500 }
    );
  }
}

