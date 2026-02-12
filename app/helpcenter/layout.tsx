import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "JNTUH Results help center. Report bugs, get support, and find answers for using the results portal.",
  alternates: { canonical: `${SITE_URL}/helpcenter` },
  openGraph: {
    type: "website",
    title: "Help Center | JNTUH Results",
    description: "Get help, report bugs, and support for JNTUH Results portal.",
    url: `${SITE_URL}/helpcenter`,
    siteName: "JNTUH RESULTS",
  },
  twitter: { card: "summary_large_image", title: "Help Center | JNTUH Results", description: "Get help, report bugs, and support for JNTUH Results portal." },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
