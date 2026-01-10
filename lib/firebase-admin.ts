import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

try {
  // Check if Firebase Admin is already initialized
  if (admin.apps.length === 0) {
    // Initialize Firebase Admin SDK using service account
    const serviceAccountPath = path.join(process.cwd(), "mana-jntuh-results-firebase-adminsdk-fbsvc-56d44fb181.json");
    
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Firebase Admin SDK credentials file not found at: ${serviceAccountPath}`);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: "mana-jntuh-results",
    });

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  } else {
    adminApp = admin.apps[0] as App;
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  }
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  // Create dummy objects for type safety
  adminApp = {} as App;
  adminAuth = {} as Auth;
  adminDb = {} as Firestore;
}

export { adminApp, adminAuth, adminDb };

