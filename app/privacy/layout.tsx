import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Mana JNTUH Results. How we collect, use, and protect your information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    type: "website",
    title: "Privacy Policy | JNTUH Results",
    description: "Privacy policy for Mana JNTUH Results.",
    url: `${SITE_URL}/privacy`,
    siteName: "JNTUH RESULTS",
  },
  twitter: { card: "summary_large_image", title: "Privacy Policy | JNTUH Results", description: "Privacy policy for Mana JNTUH Results." },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
