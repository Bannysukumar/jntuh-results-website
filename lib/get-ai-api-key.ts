/**
 * Returns the Gemini API key: Firestore (admin-set) first, then env.
 * Used by /api/ai/chat so the key updates automatically when admin changes it.
 */
export async function getGeminiApiKey(): Promise<string | null> {
  try {
    const { adminDb } = await import("@/lib/firebase-admin");
    if (adminDb && typeof (adminDb as any).collection === "function") {
      const doc = await adminDb.collection("adminSettings").doc("aiAssistant").get();
      if (doc.exists) {
        const key = doc.data()?.geminiApiKey;
        if (key && typeof key === "string" && key.trim()) return key.trim();
      }
    }
  } catch (_) {
    // Firestore not available or error — fall back to env
  }
  const envKey = process.env.GEMINI_API_KEY;
  return (envKey && envKey.trim()) || null;
}
