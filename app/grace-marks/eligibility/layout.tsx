import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Grace Marks Eligibility",
  description:
    "Check if you are eligible for JNTUH grace marks based on your academic performance. Enter hall ticket number to verify eligibility.",
  alternates: { canonical: `${SITE_URL}/grace-marks/eligibility` },
  openGraph: {
    type: "website",
    title: "Grace Marks Eligibility | JNTUH Results",
    description: "Check your JNTUH grace marks eligibility with hall ticket number.",
    url: `${SITE_URL}/grace-marks/eligibility`,
    siteName: "JNTUH RESULTS",
  },
  twitter: { card: "summary_large_image", title: "Grace Marks Eligibility | JNTUH Results", description: "Check your JNTUH grace marks eligibility with hall ticket number." },
};

export default function GraceMarksEligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
