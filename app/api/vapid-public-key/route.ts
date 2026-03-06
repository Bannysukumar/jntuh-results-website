import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

// Public endpoint to get VAPID public key (needed for client-side subscription)
export async function GET(_request: NextRequest) {
  let publicKey: string | null = null;

  // Try Firestore only if adminDb is actually initialized (has .collection)
  if (adminDb && typeof (adminDb as any).collection === "function") {
    try {
      const vapidKeysDoc = await (adminDb as any)
        .collection("adminSettings")
        .doc("vapidKeys")
        .get();
      if (vapidKeysDoc?.exists && vapidKeysDoc.data()?.publicKey) {
        publicKey = vapidKeysDoc.data().publicKey;
      }
    } catch (error) {
      // Firestore unavailable or error — fall through to env
    }
  }

  if (!publicKey) {
    publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null;
  }

  // Always return 200 so client can gracefully skip push when key is missing
  return NextResponse.json({
    success: !!publicKey,
    publicKey: publicKey,
  });
}

