import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

// Public endpoint to get VAPID public key (needed for client-side subscription)
export async function GET(request: NextRequest) {
  try {
    // Try to get from Firestore first
    const vapidKeysDoc = await adminDb.collection("adminSettings").doc("vapidKeys").get();
    
    if (vapidKeysDoc.exists) {
      const data = vapidKeysDoc.data();
      if (data?.publicKey) {
        return NextResponse.json({
          success: true,
          publicKey: data.publicKey,
        });
      }
    }

    // Fallback to environment variable
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    
    if (!publicKey) {
      return NextResponse.json(
        { error: "VAPID public key not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      publicKey: publicKey,
    });
  } catch (error: any) {
    console.error("Error fetching VAPID public key:", error);
    // Fallback to environment variable
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    
    if (publicKey) {
      return NextResponse.json({
        success: true,
        publicKey: publicKey,
      });
    }

    return NextResponse.json(
      { error: "VAPID public key not available" },
      { status: 500 }
    );
  }
}

