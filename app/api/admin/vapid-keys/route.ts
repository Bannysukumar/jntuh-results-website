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

// GET - Retrieve VAPID keys (public key only for security)
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Get VAPID keys from Firestore
    const vapidKeysDoc = await adminDb.collection("adminSettings").doc("vapidKeys").get();
    
    if (vapidKeysDoc.exists) {
      const data = vapidKeysDoc.data();
      return NextResponse.json({
        success: true,
        publicKey: data?.publicKey || null,
        privateKey: data?.privateKey || null, // Only admins can see private key
        email: data?.email || null,
        updatedAt: data?.updatedAt?.toDate?.() || null,
      });
    }

    // Fallback to environment variables
    return NextResponse.json({
      success: true,
      publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null,
      privateKey: process.env.VAPID_PRIVATE_KEY || null,
      email: process.env.VAPID_EMAIL || "mailto:admin@manajntuhresults.vercel.app",
      updatedAt: null,
      source: "environment",
    });
  } catch (error: any) {
    console.error("Error fetching VAPID keys:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch VAPID keys" },
      { status: 500 }
    );
  }
}

// POST/PUT - Update VAPID keys
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { publicKey, privateKey, email } = await request.json();

    if (!publicKey || !privateKey) {
      return NextResponse.json(
        { error: "Public key and private key are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (email && !email.startsWith("mailto:")) {
      return NextResponse.json(
        { error: "Email must start with 'mailto:'" },
        { status: 400 }
      );
    }

    // Store in Firestore
    await adminDb.collection("adminSettings").doc("vapidKeys").set({
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      email: email?.trim() || "mailto:admin@manajntuhresults.vercel.app",
      updatedAt: new Date(),
      updatedBy: "admin", // Could be enhanced to track which admin
    }, { merge: true });

    return NextResponse.json({
      success: true,
      message: "VAPID keys updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating VAPID keys:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update VAPID keys" },
      { status: 500 }
    );
  }
}

// PUT - Alias for POST
export async function PUT(request: NextRequest) {
  return POST(request);
}

