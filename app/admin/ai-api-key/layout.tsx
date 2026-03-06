import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant API Key | Admin",
  description: "Manage the AI Assistant (Gemini) API key",
  robots: { index: false, follow: true },
};

export default function AIApiKeyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
