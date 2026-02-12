import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Backlog Report",
  description:
    "Get your JNTUH backlog report with hall ticket number. See current backlog status, subjects to clear, and plan your next steps.",
  alternates: { canonical: `${SITE_URL}/backlogreport` },
  openGraph: {
    title: "Backlog Report | JNTUH Results",
    description: "Get your JNTUH backlog report. See current backlog status and subjects to clear.",
    url: `${SITE_URL}/backlogreport`,
    siteName: "JNTUH RESULTS",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
