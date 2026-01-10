import { adminAuth, adminDb } from "./firebase-admin";

export async function verifyAdminUser(idToken: string): Promise<boolean> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check custom claims
    if (decodedToken.admin === true || decodedToken.role === "admin") {
      return true;
    }

    // Check Firestore for admin role
    const adminDoc = await adminDb.collection("admins").doc(decodedToken.uid).get();
    if (adminDoc.exists && adminDoc.data()?.role === "admin") {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error verifying admin user:", error);
    return false;
  }
}

export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    // Check Firestore for admin role
    const adminDoc = await adminDb.collection("admins").doc(uid).get();
    return adminDoc.exists && adminDoc.data()?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

