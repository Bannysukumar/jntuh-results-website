import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!adminAuth || typeof (adminAuth as any).verifyIdToken !== "function") {
      console.error("Firebase Admin SDK not properly initialized");
      return NextResponse.json(
        {
          error: "Admin service unavailable",
          isAdmin: false,
        },
        { status: 500 }
      );
    }

    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { 
          error: "ID token is required",
          isAdmin: false 
        },
        { status: 400 }
      );
    }

    // Verify the ID token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (tokenError: any) {
      console.error("Token verification error:", tokenError.code, tokenError.message);
      
      // Handle specific token errors
      if (tokenError.code === "auth/id-token-expired") {
        return NextResponse.json(
          {
            error: "Token expired",
            isAdmin: false,
          },
          { status: 401 }
        );
      } else if (tokenError.code === "auth/id-token-revoked") {
        return NextResponse.json(
          {
            error: "Token revoked",
            isAdmin: false,
          },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          {
            error: "Invalid token",
            isAdmin: false,
          },
          { status: 401 }
        );
      }
    }
    
    // Check custom claims for admin role
    const isAdmin = decodedToken.admin === true || decodedToken.role === "admin";

    // Also check Firestore for admin role if Admin SDK is available
    let isAdminInDb = false;
    if (adminDb) {
      try {
        const adminDoc = await adminDb.collection("admins").doc(decodedToken.uid).get();
        isAdminInDb = adminDoc.exists && adminDoc.data()?.role === "admin";
      } catch (dbError) {
        console.error("Error checking Firestore admin collection:", dbError);
        // Continue without Firestore check if it fails
      }
    }

    return NextResponse.json({
      isAdmin: isAdmin || isAdminInDb,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error: any) {
    console.error("Unexpected error checking admin status:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to verify admin status",
        isAdmin: false,
      },
      { status: 500 }
    );
  }
}

