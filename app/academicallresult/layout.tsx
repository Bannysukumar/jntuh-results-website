import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Results",
  description:
    "View all JNTUH semester results in one place. Check every exam result you have taken with your hall ticket number.",
  alternates: { canonical: `${SITE_URL}/academicallresult` },
  openGraph: {
    title: "All Results | JNTUH Results",
    description: "View all JNTUH semester results in one place. Check every exam result with your hall ticket number.",
    url: `${SITE_URL}/academicallresult`,
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
