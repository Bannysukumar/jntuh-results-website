/**
 * Admin utilities for Group Chat moderation
 * These functions can be called from:
 * - Admin panel
 * - Browser console
 * - Button click handlers
 */

import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

/**
 * Ban a user by device ID
 * @param deviceId - The device ID to ban
 * @param reason - Reason for the ban (default: "Abuse")
 * @returns Promise<void>
 * 
 * Usage example:
 * await banUser("dev_123456", "Spamming messages");
 */
export async function banUser(deviceId: string, reason: string = "Abuse") {
  if (!deviceId) {
    throw new Error("Device ID is required");
  }

  try {
    await setDoc(doc(db, "bannedUsers", deviceId), {
      reason,
      bannedAt: Date.now(),
      bannedBy: "admin",
    });
    console.log(`✅ User ${deviceId} has been banned. Reason: ${reason}`);
  } catch (error) {
    console.error("❌ Error banning user:", error);
    throw error;
  }
}

/**
 * Unban a user by device ID
 * @param deviceId - The device ID to unban
 * @returns Promise<void>
 * 
 * Usage example:
 * await unbanUser("dev_123456");
 */
export async function unbanUser(deviceId: string) {
  if (!deviceId) {
    throw new Error("Device ID is required");
  }

  try {
    await deleteDoc(doc(db, "bannedUsers", deviceId));
    console.log(`✅ User ${deviceId} has been unbanned.`);
  } catch (error) {
    console.error("❌ Error unbanning user:", error);
    throw error;
  }
}

/**
 * Check if a user is banned
 * @param deviceId - The device ID to check
 * @returns Promise<{ banned: boolean; reason?: string; bannedAt?: number }>
 * 
 * Usage example:
 * const status = await checkBanStatus("dev_123456");
 * if (status.banned) {
 *   console.log("User is banned. Reason:", status.reason);
 * }
 */
export async function checkBanStatus(deviceId: string) {
  if (!deviceId) {
    throw new Error("Device ID is required");
  }

  try {
    const banRef = doc(db, "bannedUsers", deviceId);
    const banSnap = await getDoc(banRef);

    if (banSnap.exists()) {
      const data = banSnap.data();
      return {
        banned: true,
        reason: data.reason || "Violation",
        bannedAt: data.bannedAt || Date.now(),
        bannedBy: data.bannedBy || "admin",
      };
    }

    return { banned: false };
  } catch (error) {
    console.error("❌ Error checking ban status:", error);
    throw error;
  }
}

/**
 * Get device ID from localStorage (for testing/admin use)
 * @returns string | null
 * 
 * Usage example:
 * const deviceId = getDeviceId();
 * if (deviceId) {
 *   await banUser(deviceId, "Test ban");
 * }
 */
export function getDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("deviceId");
}

/**
 * Ban current user (for testing purposes)
 * @param reason - Reason for the ban
 * @returns Promise<void>
 * 
 * Usage example:
 * await banCurrentUser("Testing ban system");
 */
export async function banCurrentUser(reason: string = "Test ban") {
  const deviceId = getDeviceId();
  if (!deviceId) {
    throw new Error("No device ID found. User must have visited the chat page at least once.");
  }
  await banUser(deviceId, reason);
}

// Make functions available globally for console access
if (typeof window !== "undefined") {
  (window as any).groupChatAdmin = {
    banUser,
    unbanUser,
    checkBanStatus,
    getDeviceId,
    banCurrentUser,
  };
  
  console.log("🔧 Group Chat Admin functions available at window.groupChatAdmin");
  console.log("📝 Usage: await window.groupChatAdmin.banUser('dev_123', 'reason')");
}

