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

export async function GET(request: NextRequest) {
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

    // Try to get results checked count from analytics collection
    // If the collection doesn't exist or has no data, return 0
    let resultsChecked = 0;
    try {
      const analyticsDoc = await adminDb.collection("analytics").doc("stats").get();
      if (analyticsDoc.exists) {
        const data = analyticsDoc.data();
        resultsChecked = data?.resultsChecked || 0;
      }
    } catch (error) {
      // Collection doesn't exist yet, that's okay
      console.log("Analytics collection not found, returning 0");
    }

    return NextResponse.json({
      success: true,
      resultsChecked,
    });
  } catch (error: any) {
    console.error("Error fetching analytics stats:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch analytics stats",
      },
      { status: 500 }
    );
  }
}

