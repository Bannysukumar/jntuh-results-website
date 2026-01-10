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

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all messages
    const messagesSnapshot = await adminDb.collection("groupChatMessages").get();

    // Delete all messages in batches
    const batch = adminDb.batch();
    let count = 0;

    messagesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
      count++;
    });

    // Commit the batch deletion
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${count} messages`,
      deletedCount: count,
    });
  } catch (error: any) {
    console.error("Error clearing chat:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to clear chat",
        success: false,
      },
      { status: 500 }
    );
  }
}

