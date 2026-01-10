import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/admin-auth";

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
    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin SDK not properly initialized" },
        { status: 500 }
      );
    }

    // Verify admin access
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Clear feedback collection (Firestore batch limit is 500 operations)
    const feedbackSnapshot = await adminDb.collection("feedback").get();
    let feedbackCount = 0;
    const BATCH_SIZE = 500;
    
    // Process in batches of 500
    const docs = feedbackSnapshot.docs;
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      const batch = adminDb.batch();
      const batchDocs = docs.slice(i, i + BATCH_SIZE);
      
      batchDocs.forEach((doc) => {
        batch.delete(doc.ref);
        feedbackCount++;
      });
      
      if (batchDocs.length > 0) {
        await batch.commit();
      }
    }

    // Note: We don't clear users or admins collections as that would be too dangerous
    // Only clearing feedback and other non-critical data collections

    return NextResponse.json({
      success: true,
      message: `Cleared ${feedbackCount} feedback entries. User data was preserved for safety.`,
      clearedCount: feedbackCount,
    });
  } catch (error: any) {
    console.error("Error clearing data:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to clear data",
      },
      { status: 500 }
    );
  }
}

