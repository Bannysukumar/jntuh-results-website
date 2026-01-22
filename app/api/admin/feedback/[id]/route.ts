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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { status } = await request.json();

    if (!status || !["new", "read", "resolved"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'new', 'read', or 'resolved'" },
        { status: 400 }
      );
    }

    await adminDb.collection("feedback").doc(params.id).update({
      status,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Feedback status updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating feedback status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update feedback status" },
      { status: 500 }
    );
  }
}

