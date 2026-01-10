import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!adminAuth || typeof (adminAuth as any).getUserByEmail !== "function") {
      return NextResponse.json(
        { error: "Firebase Admin SDK not properly initialized" },
        { status: 500 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Get user by email
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        return NextResponse.json(
          { error: "User not found. Please create the user first." },
          { status: 404 }
        );
      }
      throw error;
    }

    // Set custom claims for admin role
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: "admin",
    });

    // Store in Firestore admins collection
    await adminDb.collection("admins").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Also update or create in users collection
    await adminDb.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      name: userRecord.displayName || email.split("@")[0],
      role: "admin",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({
      success: true,
      message: `User ${email} has been granted admin privileges`,
      uid: userRecord.uid,
      email: email,
    });
  } catch (error: any) {
    console.error("Error making user admin:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to grant admin privileges",
        code: error.code,
      },
      { status: 500 }
    );
  }
}

