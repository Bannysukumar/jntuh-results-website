import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Feedback | Mana JNTUH Results",
  description: "Admin feedback management",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminFeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

