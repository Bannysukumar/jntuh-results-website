import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function DELETE(request: NextRequest) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!adminAuth || typeof (adminAuth as any).deleteUser !== "function") {
      return NextResponse.json(
        { error: "Firebase Admin SDK not properly initialized" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Delete user from Firebase Auth
    await adminAuth.deleteUser(uid);

    // Delete user from Firestore users collection
    await adminDb.collection("users").doc(uid).delete();

    // Delete user from admins collection if exists
    await adminDb.collection("admins").doc(uid).delete().catch(() => {
      // Ignore error if document doesn't exist
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to delete user",
        code: error.code,
      },
      { status: 500 }
    );
  }
}

