import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Grace Marks",
  description: "Check JNTUH grace marks eligibility and get proof documents for verification.",
  alternates: { canonical: `${SITE_URL}/grace-marks` },
  openGraph: {
    type: "website",
    title: "Grace Marks | JNTUH Results",
    description: "Check JNTUH grace marks eligibility and get proof documents.",
    url: `${SITE_URL}/grace-marks`,
    siteName: "JNTUH RESULTS",
  },
  twitter: { card: "summary_large_image", title: "Grace Marks | JNTUH Results", description: "Check JNTUH grace marks eligibility and get proof documents." },
};

export default function GraceMarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

