import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check custom claims for admin role
    const isAdmin = decodedToken.admin === true || decodedToken.role === "admin";

    // Also check Firestore for admin role
    const adminDoc = await adminDb.collection("admins").doc(decodedToken.uid).get();
    const isAdminInDb = adminDoc.exists && adminDoc.data()?.role === "admin";

    return NextResponse.json({
      isAdmin: isAdmin || isAdminInDb,
      uid: decodedToken.uid,
      email: decodedToken.email,
      claims: decodedToken,
    });
  } catch (error: any) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to verify admin status",
        isAdmin: false,
      },
      { status: 401 }
    );
  }
}

