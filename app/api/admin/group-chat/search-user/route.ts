import { NextRequest, NextResponse } from "next/server";
import { verifyAdminUser } from "@/lib/admin-auth";
import { adminDb } from "@/lib/firebase-admin";
import { adminApp } from "@/lib/firebase-admin";
import { getDatabase } from "firebase-admin/database";

export const dynamic = 'force-dynamic';

async function verifyAdmin(request: NextRequest): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isAdmin: false, error: "Authorization header required" };
    }

    const idToken = authHeader.substring(7);
    const isAdmin = await verifyAdminUser(idToken);
    return { isAdmin };
  } catch (error: any) {
    return { isAdmin: false, error: error.message };
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Search for messages by username (Firestore doesn't support case-insensitive queries directly)
    // We'll get all recent messages and filter client-side, or use a case-insensitive approach
    const searchTerm = username.trim().toLowerCase();
    
    // Get recent messages (last 500) and filter by username
    const messagesSnapshot = await adminDb
      .collection("groupChatMessages")
      .orderBy("timestamp", "desc")
      .limit(500)
      .get();

    const messages: Array<{
      id: string;
      username: string;
      text: string;
      timestamp: any;
      deviceId?: string;
    }> = [];

    // Filter messages by username (case-insensitive)
    messagesSnapshot.forEach((doc) => {
      const data = doc.data();
      const messageUsername = (data.username || "").toLowerCase();
      if (messageUsername.includes(searchTerm)) {
        messages.push({
          id: doc.id,
          username: data.username || "Unknown",
          deviceId: data.deviceId || "unknown",
          text: data.text || "",
          timestamp: data.timestamp,
        });
      }
    });

    // Get unique usernames that match
    const uniqueUsernames = Array.from(new Set(messages.map((m) => m.username)));

    // Try to get device IDs from userDeviceMappings collection (username → deviceId)
    const usernameToDeviceIds = new Map<string, Set<string>>();
    
    for (const username of uniqueUsernames) {
      try {
        // Check Firestore mapping
        const mappingDoc = await adminDb.collection("userDeviceMappings").doc(username).get();
        if (mappingDoc.exists) {
          const data = mappingDoc.data();
          if (data?.deviceId) {
            if (!usernameToDeviceIds.has(username)) {
              usernameToDeviceIds.set(username, new Set());
            }
            usernameToDeviceIds.get(username)!.add(data.deviceId);
          }
        }
        
        // Also get device IDs from messages (if stored)
        const messageDeviceIds = messages
          .filter((m: any) => m.username === username && m.deviceId && m.deviceId !== "unknown")
          .map((m: any) => m.deviceId);
        
        if (messageDeviceIds.length > 0) {
          if (!usernameToDeviceIds.has(username)) {
            usernameToDeviceIds.set(username, new Set());
          }
          messageDeviceIds.forEach((deviceId: string) => {
            usernameToDeviceIds.get(username)!.add(deviceId);
          });
        }
      } catch (error) {
        console.error(`Error getting device ID for ${username}:`, error);
      }
    }

    // Try to get device IDs from active users (Realtime Database)
    try {
      // Get database instance (databaseURL is already set in firebase-admin.ts initialization)
      const db = getDatabase(adminApp);
      const presenceRef = db.ref("presence");
      const snapshot = await presenceRef.once("value");
      const presenceData = snapshot.val();
      
      if (presenceData) {
        Object.values(presenceData).forEach((user: any) => {
          if (user.username && user.deviceId && uniqueUsernames.includes(user.username)) {
            if (!usernameToDeviceIds.has(user.username)) {
              usernameToDeviceIds.set(user.username, new Set());
            }
            usernameToDeviceIds.get(user.username)!.add(user.deviceId);
          }
        });
      }
    } catch (error) {
      console.error("Error getting device IDs from presence:", error);
    }

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
      uniqueUsernames,
      usernameToDeviceIds: Object.fromEntries(
        Array.from(usernameToDeviceIds.entries()).map(([username, deviceIds]) => [
          username,
          Array.from(deviceIds),
        ])
      ),
    });
  } catch (error: any) {
    console.error("Error searching user:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to search user",
        messages: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}

