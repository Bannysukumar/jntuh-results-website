import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { anon_id, roll_number, subscription } = await request.json();

    if (!subscription || !anon_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Store subscription in Firestore
    const subscriptionData = {
      anonId: anon_id,
      rollNumber: roll_number || null,
      subscription: subscription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Use subscription endpoint as document ID for uniqueness
    const subscriptionId = subscription.keys?.p256dh || anon_id;
    
    await adminDb
      .collection("pushSubscriptions")
      .doc(subscriptionId)
      .set(subscriptionData, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

