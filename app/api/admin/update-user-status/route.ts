import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!adminDb || typeof (adminDb as any).collection !== "function") {
      return NextResponse.json(
        { error: "Firebase Admin SDK not properly initialized" },
        { status: 500 }
      );
    }

    const { uid, status } = await request.json();

    if (!uid || !status) {
      return NextResponse.json(
        { error: "User ID and status are required" },
        { status: 400 }
      );
    }

    if (!["active", "inactive", "suspended"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be active, inactive, or suspended" },
        { status: 400 }
      );
    }

    // Update user status in Firestore
    // First ensure the user document exists in Firestore
    const userDocRef = adminDb.collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    
    if (userDoc.exists) {
      await userDocRef.update({
        status: status,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // If user document doesn't exist, create it with basic info from Auth
      try {
        const authUser = await adminAuth.getUser(uid);
        await userDocRef.set({
          uid: uid,
          email: authUser.email || "",
          name: authUser.displayName || "",
          role: (authUser.customClaims?.role as string) || "viewer",
          status: status,
          createdAt: authUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: null,
        }, { merge: true });
      } catch (error) {
        console.error("Error creating user document:", error);
      }
    }

    // Update disabled status in Firebase Auth
    // - Suspended: disabled = true (user cannot login)
    // - Inactive: disabled = false (user can login but is marked inactive)
    // - Active: disabled = false (user can login)
    try {
      await adminAuth.updateUser(uid, {
        disabled: status === "suspended",
      });
    } catch (error) {
      console.error("Error updating user disabled status in Auth:", error);
      // Continue even if this fails - Firestore update is primary
    }

    return NextResponse.json({
      success: true,
      message: `User status updated to ${status}`,
    });
  } catch (error: any) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update user status",
        code: error.code,
      },
      { status: 500 }
    );
  }
}

