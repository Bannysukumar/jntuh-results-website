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
    let credential;
    const projectId = "mana-jntuh-results";

    // Try to use environment variable first (for Vercel/production)
    if (process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) {
      try {
        const serviceAccountJson = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccountJson as admin.ServiceAccount);
      } catch (parseError) {
        console.error("Error parsing FIREBASE_ADMIN_SERVICE_ACCOUNT env var:", parseError);
      }
    }

    // Fall back to file-based credentials (for local development)
    if (!credential) {
      try {
        const serviceAccountPath = path.join(process.cwd(), "mana-jntuh-results-firebase-adminsdk-fbsvc-56d44fb181.json");
        
        if (fs.existsSync(serviceAccountPath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
          credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
        } else {
          // In production on Vercel, the file won't exist, so try individual env vars as fallback
          if (process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
            credential = admin.credential.cert({
              projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
            } as admin.ServiceAccount);
          } else {
            throw new Error("Firebase Admin SDK credentials not found. Please set FIREBASE_ADMIN_SERVICE_ACCOUNT env var or provide credentials file.");
          }
        }
      } catch (fileError) {
        console.error("Error loading Firebase Admin SDK credentials from file:", fileError);
        // If file doesn't exist and no env vars, throw error
        if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
          throw new Error("Firebase Admin SDK credentials not available. Please configure FIREBASE_ADMIN_SERVICE_ACCOUNT environment variable.");
        }
      }
    }

    if (!credential) {
      throw new Error("Unable to initialize Firebase Admin SDK credentials");
    }

    adminApp = admin.initializeApp({
      credential,
      projectId,
    });

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    
    console.log("Firebase Admin SDK initialized successfully");
  } else {
    adminApp = admin.apps[0] as App;
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  }
} catch (error: any) {
  console.error("Error initializing Firebase Admin SDK:", error?.message || error);
  // In production, we should still export the objects but they won't work
  // This prevents the entire app from crashing
  if (admin.apps.length > 0) {
    adminApp = admin.apps[0] as App;
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  } else {
    // Create dummy objects for type safety - but log the error
    console.error("CRITICAL: Firebase Admin SDK not initialized. Admin features will not work.");
    adminApp = {} as App;
    adminAuth = {} as Auth;
    adminDb = {} as Firestore;
  }
}

export { adminApp, adminAuth, adminDb };

