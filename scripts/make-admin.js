/**
 * Script to grant admin privileges to an existing user
 * Usage: node scripts/make-admin.js <email>
 * Example: node scripts/make-admin.js fjsfhgdjg@gmail.com
 */

const admin = require("firebase-admin");
const serviceAccount = require("../mana-jntuh-results-firebase-adminsdk-fbsvc-56d44fb181.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "mana-jntuh-results",
});

const email = process.argv[2] || "fjsfhgdjg@gmail.com";

async function makeAdmin() {
  try {
    console.log(`Granting admin privileges to: ${email}...`);
    
    // Get user by email
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log("✓ User found:", userRecord.uid);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.error(`❌ Error: User with email ${email} not found in Firebase Auth.`);
        console.error("Please create the user first using the User Management page.");
        process.exit(1);
      }
      throw error;
    }

    // Set custom claims for admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: "admin",
    });
    console.log("✓ Admin custom claims set");

    // Store in Firestore admins collection
    const db = admin.firestore();
    await db.collection("admins").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log("✓ Admin data stored in Firestore (admins collection)");

    // Also update or create in users collection
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      name: userRecord.displayName || email.split("@")[0],
      role: "admin",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log("✓ User data stored in Firestore (users collection)");

    console.log("\n✅ Admin privileges granted successfully!");
    console.log("Email:", email);
    console.log("UID:", userRecord.uid);
    console.log("\nNote: The user will need to log out and log back in for the changes to take effect.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error granting admin privileges:", error);
    process.exit(1);
  }
}

makeAdmin();

