import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Group Chat",
  description:
    "Connect with fellow JNTUH students through real-time group chat.",
  alternates: { canonical: `${SITE_URL}/group-chat` },
  openGraph: {
    title: "Group Chat | JNTUH Results",
    description: "Real-time group chat for JNTUH students.",
    url: `${SITE_URL}/group-chat`,
    siteName: "JNTUH RESULTS",
  },
};

export default function GroupChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

