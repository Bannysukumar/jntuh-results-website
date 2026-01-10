import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!adminAuth || typeof (adminAuth as any).createUser !== "function") {
      return NextResponse.json(
        { error: "Firebase Admin SDK not properly initialized" },
        { status: 500 }
      );
    }
    const { name, email, password, role, status } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["admin", "moderator", "viewer"];
    const userRole = role || "viewer";
    if (!validRoles.includes(userRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["active", "inactive", "suspended"];
    const userStatus = status || "active";
    if (!validStatuses.includes(userStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Create user with Firebase Admin SDK
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email: email,
        password: password,
        emailVerified: false,
        displayName: name,
      });
    } catch (error: any) {
      if (error.code === "auth/email-already-exists") {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }
      throw error;
    }

    // Set custom claims based on role
    const customClaims: any = {
      role: userRole,
    };

    // Explicitly set admin claim based on role
    if (userRole === "admin") {
      customClaims.admin = true;
    } else {
      // Explicitly set admin to false for non-admin roles
      customClaims.admin = false;
    }

    await adminAuth.setCustomUserClaims(userRecord.uid, customClaims);

    // Set disabled status based on status
    // - Suspended: disabled = true (user cannot login)
    // - Inactive or Active: disabled = false (user can login)
    if (userStatus === "suspended") {
      await adminAuth.updateUser(userRecord.uid, {
        disabled: true,
      });
    }

    // Store user data in Firestore
    const userDoc = {
      uid: userRecord.uid,
      email: email,
      name: name,
      role: userRole,
      status: userStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
    };

    await adminDb.collection("users").doc(userRecord.uid).set(userDoc, {
      merge: true,
    });

    // Also add to admins collection if role is admin
    if (userRole === "admin") {
      await adminDb.collection("admins").doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: email,
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        name: name,
        role: userRole,
        status: userStatus,
        createdAt: userDoc.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create user",
        code: error.code,
      },
      { status: 500 }
    );
  }
}

