import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Result Contrast",
  description:
    "Compare your JNTUH academic performance across semesters with a classmate. Result contrast and performance insights.",
  alternates: { canonical: `${SITE_URL}/resultcontrast` },
  openGraph: {
    title: "Result Contrast | JNTUH Results",
    description: "Compare your JNTUH performance across semesters with classmates.",
    url: `${SITE_URL}/resultcontrast`,
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
