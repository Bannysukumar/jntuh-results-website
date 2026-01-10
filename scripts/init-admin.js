/**
 * Script to initialize admin account in Firebase
 * Run with: node scripts/init-admin.js
 */

const admin = require("firebase-admin");
const serviceAccount = require("../mana-jntuh-results-firebase-adminsdk-fbsvc-56d44fb181.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "mana-jntuh-results",
});

const email = "bannysukumar@gmail.com";
const password = "Banny2255@@##";

async function initAdmin() {
  try {
    console.log("Initializing admin account...");
    
    let userRecord;
    try {
      // Create user
      userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        emailVerified: true,
      });
      console.log("✓ Admin user created:", userRecord.uid);
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        // User already exists, get it
        userRecord = await admin.auth().getUserByEmail(email);
        console.log("✓ Admin user already exists:", userRecord.uid);
        
        // Update password
        await admin.auth().updateUser(userRecord.uid, {
          password: password,
        });
        console.log("✓ Password updated");
      } else {
        throw error;
      }
    }

    // Set custom claims for admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: "admin",
    });
    console.log("✓ Admin custom claims set");

    // Store in Firestore
    const db = admin.firestore();
    await db.collection("admins").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log("✓ Admin data stored in Firestore");

    console.log("\n✅ Admin account initialized successfully!");
    console.log("Email:", email);
    console.log("UID:", userRecord.uid);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing admin account:", error);
    process.exit(1);
  }
}

initAdmin();

