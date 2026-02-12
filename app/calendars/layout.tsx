import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Calendars",
  description:
    "JNTUH academic calendars for the current year. Exam schedules, semester dates, and events in one place.",
  alternates: { canonical: `${SITE_URL}/calendars` },
  openGraph: {
    title: "Calendars | JNTUH Results",
    description: "JNTUH academic calendars, exam schedules, and semester dates.",
    url: `${SITE_URL}/calendars`,
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
