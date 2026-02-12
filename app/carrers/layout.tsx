import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jobs & Careers",
  description:
    "JNTUH jobs and careers. Find internships, placements, and kickstart your professional journey.",
  alternates: { canonical: `${SITE_URL}/carrers` },
  openGraph: {
    type: "website",
    title: "Jobs & Careers | JNTUH Results",
    description: "Find JNTUH internships, jobs, and career opportunities.",
    url: `${SITE_URL}/carrers`,
    siteName: "JNTUH RESULTS",
  },
  twitter: { card: "summary_large_image", title: "Jobs & Careers | JNTUH Results", description: "Find JNTUH internships, jobs, and career opportunities." },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
