import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
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

    const settingsDoc = await adminDb.collection("settings").doc("site-settings").get();

    if (settingsDoc.exists) {
      const data = settingsDoc.data();
      return NextResponse.json({
        success: true,
        settings: {
          ...data,
          updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || data?.updatedAt,
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: null,
    });
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch settings",
      },
      { status: 500 }
    );
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

    const settings = await request.json();

    // Remove updatedAt from incoming data, we'll set it server-side
    const { updatedAt, ...settingsToSave } = settings;

    await adminDb.collection("settings").doc("site-settings").set(
      {
        ...settingsToSave,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error: any) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to save settings",
      },
      { status: 500 }
    );
  }
}

