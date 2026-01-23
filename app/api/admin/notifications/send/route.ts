import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import webpush, { PushSubscription } from "web-push";

export const dynamic = 'force-dynamic';

async function verifyAdmin(request: NextRequest): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isAdmin: false, error: "Missing authorization header" };
    }

    const idToken = authHeader.split("Bearer ")[1];
    const { verifyAdminUser } = await import("@/lib/admin-auth");
    const isAdmin = await verifyAdminUser(idToken);
    
    return { isAdmin, error: isAdmin ? undefined : "Unauthorized" };
  } catch (error: any) {
    console.error("Error verifying admin:", error);
    return { isAdmin: false, error: error.message || "Unauthorized" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, body, url, duration } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    // Get VAPID keys from Firestore first, fallback to environment
    let vapidPublicKey: string | null = null;
    let vapidPrivateKey: string | null = null;
    let vapidEmail: string = "mailto:admin@manajntuhresults.vercel.app";

    try {
      const vapidKeysDoc = await adminDb.collection("adminSettings").doc("vapidKeys").get();
      if (vapidKeysDoc.exists) {
        const data = vapidKeysDoc.data();
        vapidPublicKey = data?.publicKey || null;
        vapidPrivateKey = data?.privateKey || null;
        vapidEmail = data?.email || vapidEmail;
      }
    } catch (error) {
      console.error("Error fetching VAPID keys from Firestore:", error);
    }

    // Fallback to environment variables
    if (!vapidPublicKey) {
      vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null;
    }
    if (!vapidPrivateKey) {
      vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || null;
    }
    if (vapidEmail === "mailto:admin@manajntuhresults.vercel.app") {
      vapidEmail = process.env.VAPID_EMAIL || vapidEmail;
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        { error: "VAPID keys not configured. Please configure them in the admin panel." },
        { status: 500 }
      );
    }

    // Set VAPID details
    webpush.setVapidDetails(
      vapidEmail,
      vapidPublicKey,
      vapidPrivateKey
    );

    // Fetch all subscriptions from Firestore
    const subscriptionsSnapshot = await adminDb
      .collection("pushSubscriptions")
      .get();

    const subscriptions = subscriptionsSnapshot.docs.map(doc => doc.data());
    const totalSubscriptions = subscriptions.length;

    if (totalSubscriptions === 0) {
      return NextResponse.json(
        { error: "No subscriptions found" },
        { status: 404 }
      );
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title: title,
      body: body,
      url: url || "https://manajntuhresults.vercel.app/academicresult",
      icon: "https://manajntuhresults.vercel.app/android-chrome-512x512.png",
    });

    // Send notifications to all subscribers
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            sub.subscription as PushSubscription,
            payload
          );
          return { success: true, subscriptionId: sub.anonId };
        } catch (error: any) {
          // If subscription is invalid, remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
            const subscriptionId = sub.subscription?.keys?.p256dh || sub.anonId;
            await adminDb
              .collection("pushSubscriptions")
              .doc(subscriptionId)
              .delete()
              .catch(console.error);
          }
          return { success: false, error: error.message, subscriptionId: sub.anonId };
        }
      })
    );

    const successful = results.filter(r => r.status === "fulfilled" && r.value.success).length;
    const failed = totalSubscriptions - successful;

    // Log notification send event
    await adminDb.collection("notificationLogs").add({
      title,
      body,
      url: url || null,
      duration: duration || 30, // Store duration (in seconds) for reference
      totalSubscriptions,
      successful,
      failed,
      sentAt: Timestamp.now(),
      sentBy: "admin", // Could be enhanced to track which admin sent it
    });

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${successful} out of ${totalSubscriptions} subscribers`,
      successful,
      failed,
      total: totalSubscriptions,
    });
  } catch (error: any) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send notifications" },
      { status: 500 }
    );
  }
}

