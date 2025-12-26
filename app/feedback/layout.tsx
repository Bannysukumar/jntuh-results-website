import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Feedback | Mana JNTUH Results",
  description: "Submit your feedback and suggestions for Mana JNTUH Results",
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

