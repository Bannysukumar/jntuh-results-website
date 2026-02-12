import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Academic Result",
  description:
    "Check your JNTUH academic result with hall ticket number. View overall academic performance, grades, and CGPA for UG & PG in one place.",
  alternates: { canonical: `${SITE_URL}/academicresult` },
  openGraph: {
    title: "Academic Result | JNTUH Results",
    description: "Check your JNTUH academic result with hall ticket number. View overall academic performance, grades, and CGPA.",
    url: `${SITE_URL}/academicresult`,
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
