import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Prepare conversation for Gemini API
    // Format matches the curl example: contents array with parts containing text
    // For conversation context, include previous messages in order
    const contents: any[] = [];

    // If we have conversation history, include it as context
    if (conversationHistory.length > 0) {
      // Build a contextual prompt that includes conversation history
      let conversationContext = "Previous conversation:\n\n";
      conversationHistory.forEach((msg: { role: string; content: string }, index: number) => {
        conversationContext += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
      });
      conversationContext += `\nUser: ${message}`;
      
      contents.push({
        parts: [{ text: conversationContext }],
      });
    } else {
      // Just send the current message (matches curl example format)
      contents.push({
        parts: [{ text: message }],
      });
    }

    // Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY || "AIzaSyDzCUI8PSCDBgL1Zf0injojvPKC364N6eY",
        },
        body: JSON.stringify({
          contents: contents,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", errorData);
      
      // Handle quota exceeded error
      if (response.status === 429 || errorData.error?.message?.includes("quota") || errorData.error?.message?.includes("Quota exceeded")) {
        return NextResponse.json(
          {
            error: "AI service quota exceeded. Please try again later or contact support.",
          },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        {
          error: errorData.error?.message || errorData.error || "Failed to get response from AI",
        },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();

    // Extract the AI response text
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({
      success: true,
      message: aiResponse,
    });
  } catch (error: any) {
    console.error("Error in AI chat API:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

