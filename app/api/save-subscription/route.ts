import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

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

    // Convert subscription to plain object (it might be a PushSubscription object)
    // Handle both direct keys and nested keys structure
    const subscriptionObj = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys?.p256dh || subscription.keys?.p256dh || subscription.p256dh,
        auth: subscription.keys?.auth || subscription.keys?.auth || subscription.auth,
      },
    };

    // Generate a unique document ID from subscription keys
    // The subscription object has an 'endpoint' and 'keys' property
    let subscriptionId: string;
    
    if (subscriptionObj.keys.p256dh) {
      // Use p256dh key as the document ID (it's unique per subscription)
      subscriptionId = subscriptionObj.keys.p256dh;
    } else if (subscriptionObj.endpoint) {
      // Fallback to endpoint URL hash if keys not available
      subscriptionId = Buffer.from(subscriptionObj.endpoint).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 50);
    } else {
      // Last resort: use anon_id
      subscriptionId = anon_id;
    }

    // Store subscription in Firestore
    const subscriptionData = {
      anonId: anon_id,
      rollNumber: roll_number || null,
      subscription: subscriptionObj,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    await adminDb
      .collection("pushSubscriptions")
      .doc(subscriptionId)
      .set(subscriptionData, { merge: true });
    
    console.log(`Subscription saved with ID: ${subscriptionId} for anonId: ${anon_id}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

