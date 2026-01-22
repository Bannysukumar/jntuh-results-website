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

    // Fetch all feedback, ordered by most recent first
    const feedbackSnapshot = await adminDb
      .collection("feedback")
      .orderBy("createdAt", "desc")
      .get();

    const feedback = feedbackSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: data.status || "new",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

