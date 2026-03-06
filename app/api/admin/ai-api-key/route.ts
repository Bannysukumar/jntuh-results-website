import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

const FIRESTORE_DOC = "aiAssistant";
const COLLECTION = "adminSettings";
const KEY_FIELD = "geminiApiKey";

async function verifyAdmin(request: NextRequest): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
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

/** GET - Returns whether the AI API key is set (and optionally masked for display). */
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    if (!adminDb || typeof (adminDb as any).collection !== "function") {
      return NextResponse.json({
        apiKeySet: false,
        source: "none",
        maskedKey: null,
      });
    }

    const doc = await adminDb.collection(COLLECTION).doc(FIRESTORE_DOC).get();
    if (!doc.exists) {
      const envKey = process.env.GEMINI_API_KEY;
      return NextResponse.json({
        apiKeySet: !!envKey,
        source: envKey ? "environment" : "none",
        maskedKey: envKey ? `${envKey.slice(0, 6)}…${envKey.slice(-4)}` : null,
      });
    }

    const data = doc.data();
    const key = data?.[KEY_FIELD];
    return NextResponse.json({
      apiKeySet: !!key,
      source: "firestore",
      maskedKey: key ? `${String(key).slice(0, 6)}…${String(key).slice(-4)}` : null,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString?.() ?? null,
    });
  } catch (error: any) {
    console.error("Error fetching AI API key status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch AI API key status" },
      { status: 500 }
    );
  }
}

/** POST - Update the AI Assistant (Gemini) API key. Takes effect immediately. */
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const apiKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    if (!adminDb || typeof (adminDb as any).collection !== "function") {
      return NextResponse.json(
        { error: "Database not available. Cannot save API key." },
        { status: 503 }
      );
    }

    await adminDb.collection(COLLECTION).doc(FIRESTORE_DOC).set(
      {
        [KEY_FIELD]: apiKey,
        updatedAt: new Date(),
        updatedBy: "admin",
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: "AI Assistant API key updated. It will be used for new requests immediately.",
    });
  } catch (error: any) {
    console.error("Error updating AI API key:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update AI API key" },
      { status: 500 }
    );
  }
}
