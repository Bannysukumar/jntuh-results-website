import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Grace Marks Proof",
  description:
    "Get your JNTUH grace marks proof document for eligibility verification. Generate proof with hall ticket number.",
  alternates: { canonical: `${SITE_URL}/grace-marks/proof` },
  openGraph: {
    title: "Grace Marks Proof | JNTUH Results",
    description: "Get JNTUH grace marks proof document for verification.",
    url: `${SITE_URL}/grace-marks/proof`,
    siteName: "JNTUH RESULTS",
  },
};

export default function GraceMarksProofLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
