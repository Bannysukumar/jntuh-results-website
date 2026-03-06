import { NextRequest, NextResponse } from "next/server";
import { getGeminiApiKey } from "@/lib/get-ai-api-key";

export async function POST(request: NextRequest) {
  try {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI Assistant is not configured. Please set the API key in Admin panel." },
        { status: 503 }
      );
    }

    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

    messages.push({
      role: "system",
      content:
        "You are the official AI assistant for the Mana JNTUH Results website. " +
        "You must ONLY answer questions related to studies, academics, exams, results, colleges, branches, subject doubts, career guidance, and university-related information. " +
        "If the user asks anything that is not study/education related, politely refuse and say that you can only answer study-related questions.",
    });

    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        if (msg?.content && (msg.role === "user" || msg.role === "assistant")) {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      });
    }

    messages.push({
      role: "user",
      content: message,
    });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error:", errorData);

      const messageText =
        errorData?.error?.message ||
        errorData?.error ||
        (typeof errorData === "string" ? errorData : "") ||
        "Failed to get response from AI";

      return NextResponse.json(
        {
          error: messageText,
        },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    const aiResponse: string =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({
      success: true,
      message: aiResponse,
    });
  } catch (error: any) {
    console.error("Error in AI chat API:", error);
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

