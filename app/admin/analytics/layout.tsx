import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Analytics | Mana JNTUH Results",
  description: "Admin analytics dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

