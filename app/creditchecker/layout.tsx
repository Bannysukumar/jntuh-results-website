import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Credits Checker",
  description:
    "Check your JNTUH credits and find how many credits you need to promote to the next year or to graduate.",
  alternates: { canonical: `${SITE_URL}/creditchecker` },
  openGraph: {
    title: "Credits Checker | JNTUH Results",
    description: "Check your JNTUH credits and credits required to promote or graduate.",
    url: `${SITE_URL}/creditchecker`,
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
