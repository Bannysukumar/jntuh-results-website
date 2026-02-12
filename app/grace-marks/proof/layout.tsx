import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Grace Marks Proof",
  description:
    "Get your JNTUH grace marks proof document for eligibility verification. Generate proof with hall ticket number.",
  alternates: { canonical: `${SITE_URL}/grace-marks/proof` },
  openGraph: {
    type: "website",
    title: "Grace Marks Proof | JNTUH Results",
    description: "Get JNTUH grace marks proof document for verification.",
    url: `${SITE_URL}/grace-marks/proof`,
    siteName: "JNTUH RESULTS",
  },
  twitter: { card: "summary_large_image", title: "Grace Marks Proof | JNTUH Results", description: "Get JNTUH grace marks proof document for verification." },
};

export default function GraceMarksProofLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
