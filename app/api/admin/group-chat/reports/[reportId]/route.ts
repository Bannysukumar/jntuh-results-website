import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

async function verifyAdmin(request: NextRequest): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isAdmin: false, error: "Missing or invalid authorization header" };
    }

    const idToken = authHeader.split("Bearer ")[1];
    const { verifyAdminUser } = await import("@/lib/admin-auth");
    const isAdmin = await verifyAdminUser(idToken);
    return { isAdmin, error: isAdmin ? undefined : "User is not an admin" };
  } catch (error: any) {
    console.error("Error verifying admin:", error);
    return { isAdmin: false, error: error.message || "Failed to verify admin" };
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { reportId } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["pending", "reviewed", "resolved", "dismissed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: pending, reviewed, resolved, or dismissed" },
        { status: 400 }
      );
    }

    const reportRef = adminDb.collection("messageReports").doc(reportId);
    await reportRef.update({
      status,
      reviewedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: `Report ${status} successfully`,
    });
  } catch (error: any) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update report",
        success: false,
      },
      { status: 500 }
    );
  }
}

