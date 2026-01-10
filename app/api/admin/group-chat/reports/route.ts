import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending"; // pending, reviewed, resolved, all

    const reportsRef = adminDb.collection("messageReports");
    
    // Fetch all reports and filter/sort in memory to avoid index requirements
    const allSnapshot = await reportsRef.limit(1000).get();
    
    let reports: any[] = [];
    allSnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        messageId: data.messageId || "",
        messageText: data.messageText || "",
        reportedUsername: data.reportedUsername || "",
        reportedDeviceId: data.reportedDeviceId || "",
        reporterDeviceId: data.reporterDeviceId || "",
        reason: data.reason || "",
        status: data.status || "pending",
        timestamp: data.timestamp?.toMillis() || Date.now(),
      });
    });
    
    // Filter by status if not "all"
    if (status !== "all") {
      reports = reports.filter((r) => r.status === status);
    }
    
    // Sort by timestamp descending
    reports.sort((a, b) => b.timestamp - a.timestamp);
    
    // Limit to 100 results
    reports = reports.slice(0, 100);

    return NextResponse.json({
      success: true,
      reports,
      count: reports.length,
    });
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch reports",
        reports: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}

