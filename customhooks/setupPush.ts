import { v4 as uuidv4 } from "uuid";
import { isNative } from "@/lib/native-features";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function setupPush(rollNumber?: string) {
  // Skip service worker registration for native apps
  // Native apps use Capacitor's push notification system instead
  if (isNative()) {
    console.log("Skipping service worker registration - native app uses Capacitor push notifications");
    return;
  }

  try {
    const anonId = localStorage.getItem("anonId") || uuidv4();
    localStorage.setItem("anonId", anonId);

    console.log("Registering SW...");
    await navigator.serviceWorker.register("/sw.js");

    console.log("Waiting for ready...");
    const reg = await navigator.serviceWorker.ready;

    // Try to get VAPID key from API first, fallback to environment variable
    let key: string | null = null;
    
    try {
      const response = await fetch("/api/vapid-public-key");
      if (response.ok) {
        const data = await response.json();
        key = data.publicKey;
      }
    } catch (error) {
      console.warn("Failed to fetch VAPID key from API, using environment variable");
    }

    // Fallback to environment variable
    if (!key) {
      key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null;
    }

    if (!key) {
      console.warn("VAPID public key is not configured. Push notifications will not work.");
      return;
    }
    console.log("Using VAPID Key:", key);

    const convertedKey = urlBase64ToUint8Array(key);
    console.log("Converted key:", convertedKey);

    console.log("Subscribing to pushManager...");
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey,
    });

    console.log("Subscription success!", sub);

    // Convert PushSubscription to JSON-serializable format
    // PushSubscription has a toJSON() method, but we'll extract the data directly
    const subscriptionJson = sub.toJSON ? sub.toJSON() : {
      endpoint: sub.endpoint,
      keys: {
        p256dh: (sub as any).keys?.p256dh,
        auth: (sub as any).keys?.auth,
      },
    };

    console.log("Subscription JSON:", subscriptionJson);

    // Save subscription to our API
    const response = await fetch("/api/save-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anon_id: anonId,
        roll_number: rollNumber || null,
        subscription: subscriptionJson,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Subscription saved successfully:", result);
    } else {
      const error = await response.json();
      console.error("Failed to save subscription:", error);
    }
  } catch (err) {
    console.error("❌ Push setup failed:", err);
  }
}
