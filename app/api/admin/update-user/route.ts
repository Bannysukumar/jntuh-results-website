import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function PUT(request: NextRequest) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!adminAuth || typeof (adminAuth as any).updateUser !== "function") {
      return NextResponse.json(
        { error: "Firebase Admin SDK not properly initialized" },
        { status: 500 }
      );
    }

    const { uid, name, email, role, status } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role !== undefined) {
      const validRoles = ["admin", "moderator", "viewer"];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Update user in Firebase Auth
    const updateData: any = {};
    if (name !== undefined) {
      updateData.displayName = name;
    }
    if (email !== undefined && email !== "") {
      updateData.email = email;
    }

    if (Object.keys(updateData).length > 0) {
      await adminAuth.updateUser(uid, updateData);
    }

    // Update custom claims based on role
    if (role !== undefined) {
      const customClaims: any = {
        role: role,
      };

      // Explicitly set admin claim based on role
      if (role === "admin") {
        customClaims.admin = true;
      } else {
        // Explicitly set admin to false for non-admin roles
        customClaims.admin = false;
      }

      await adminAuth.setCustomUserClaims(uid, customClaims);

      // Update admins collection if role is admin
      if (role === "admin") {
        await adminDb.collection("admins").doc(uid).set({
          uid: uid,
          email: email || "",
          role: "admin",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } else {
        // Remove from admins collection if role is not admin
        await adminDb.collection("admins").doc(uid).delete().catch(() => {
          // Ignore error if document doesn't exist
        });
      }
    }

    // Update user data in Firestore
    const userDoc: any = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) userDoc.name = name;
    if (email !== undefined && email !== "") userDoc.email = email;
    if (role !== undefined) userDoc.role = role;
    if (status !== undefined) userDoc.status = status;

    await adminDb.collection("users").doc(uid).update(userDoc);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update user",
        code: error.code,
      },
      { status: 500 }
    );
  }
}

