import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        {
          error: "Firebase Admin SDK not properly initialized",
          users: [],
          count: 0,
        },
        { status: 500 }
      );
    }

    // Fetch all users from Firebase Auth (this is the source of truth)
    const allAuthUsers = [];
    let nextPageToken: string | undefined;
    
    do {
      const listUsersResult = await adminAuth.listUsers(1000, nextPageToken);
      allAuthUsers.push(...listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    // Fetch all Firestore user documents for additional data
    const firestoreUsersSnapshot = await adminDb.collection("users").get();
    const firestoreUsersMap = new Map();
    
    firestoreUsersSnapshot.docs.forEach((doc) => {
      firestoreUsersMap.set(doc.id, doc.data());
    });

    // Merge Auth users with Firestore data
    const users = allAuthUsers.map((authUser) => {
      const firestoreData = firestoreUsersMap.get(authUser.uid) || {};
      const customClaims = authUser.customClaims || {};
      
      // Get role from custom claims first, then Firestore, then default
      const role = customClaims.role || firestoreData.role || "viewer";
      
      // Get status from Firestore, but if user is disabled in Auth, override to suspended
      // If user is disabled in Auth but no Firestore status, set to suspended
      // Otherwise use Firestore status or default to active
      let status = firestoreData.status || "active";
      if (authUser.disabled) {
        status = "suspended";
      }
      
      // Get last login from Firestore or Auth metadata
      const lastLogin = firestoreData.lastLogin || authUser.metadata.lastRefreshTime || authUser.metadata.lastSignInTime || null;
      
      // Get creation time from Auth metadata or Firestore
      const createdAt = authUser.metadata.creationTime 
        ? new Date(authUser.metadata.creationTime).toISOString()
        : firestoreData.createdAt || new Date().toISOString();

      return {
        id: authUser.uid,
        email: authUser.email || "N/A",
        name: authUser.displayName || firestoreData.name || "N/A",
        role: role,
        status: status,
        lastLogin: lastLogin,
        createdAt: createdAt,
        emailVerified: authUser.emailVerified || false,
        disabled: authUser.disabled || false,
      };
    });

    // Sort by creation date (newest first)
    users.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      users: users,
      count: users.length,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch users",
        users: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}

