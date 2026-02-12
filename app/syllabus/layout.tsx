import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Syllabus",
  description:
    "Access JNTUH syllabus subject-wise for your academic year. UG & PG syllabus for B.Tech, M.Tech, MBA, MCA, B.Pharmacy.",
  alternates: { canonical: `${SITE_URL}/syllabus` },
  openGraph: {
    title: "Syllabus | JNTUH Results",
    description: "Access JNTUH syllabus subject-wise for your academic year.",
    url: `${SITE_URL}/syllabus`,
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
