import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about checking JNTUH results, hall ticket number, and using the portal.",
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    type: "website",
    title: "FAQ | JNTUH Results",
    description: "Frequently asked questions about JNTUH results and the portal.",
    url: `${SITE_URL}/faq`,
    siteName: "JNTUH RESULTS",
  },
  twitter: { card: "summary_large_image", title: "FAQ | JNTUH Results", description: "Frequently asked questions about JNTUH results and the portal." },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
