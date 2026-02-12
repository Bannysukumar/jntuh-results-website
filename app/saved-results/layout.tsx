import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Results",
  description: "View your saved JNTUH results locally",
  robots: { index: false, follow: true },
};

export default function SavedResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

