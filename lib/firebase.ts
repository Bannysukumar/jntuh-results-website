import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getDatabase, Database } from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIIMYJDLJbCGKDMEHtJ7gryNSCC4gdD_U",
  authDomain: "mana-jntuh-results.firebaseapp.com",
  projectId: "mana-jntuh-results",
  storageBucket: "mana-jntuh-results.firebasestorage.app",
  messagingSenderId: "863152392144",
  appId: "1:863152392144:web:68bc830364ee54a5cf9bd5",
  measurementId: "G-T8YJ4JHWKT",
  databaseURL: "https://mana-jntuh-results-default-rtdb.firebaseio.com"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let realtimeDb: Database;

if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  realtimeDb = getDatabase(app);
} else {
  // Server-side: create a dummy object
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
  realtimeDb = {} as Database;
}

export { app, auth, db, realtimeDb };

