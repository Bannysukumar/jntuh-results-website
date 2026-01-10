import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create user with Firebase Admin SDK
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email: email,
        password: password,
        emailVerified: true,
      });
    } catch (error: any) {
      // If user already exists, get the existing user
      if (error.code === "auth/email-already-exists") {
        const user = await adminAuth.getUserByEmail(email);
        userRecord = user;
        
        // Update password if needed
        try {
          await adminAuth.updateUser(user.uid, {
            password: password,
          });
        } catch (updateError) {
          console.error("Error updating password:", updateError);
        }
      } else {
        throw error;
      }
    }

    // Set custom claims for admin role
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: "admin",
    });

    // Store admin user data in Firestore
    const adminDoc = {
      uid: userRecord.uid,
      email: email,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection("admins").doc(userRecord.uid).set(adminDoc, {
      merge: true,
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created/updated successfully",
      uid: userRecord.uid,
      email: email,
    });
  } catch (error: any) {
    console.error("Error initializing admin account:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to initialize admin account",
        code: error.code,
      },
      { status: 500 }
    );
  }
}

