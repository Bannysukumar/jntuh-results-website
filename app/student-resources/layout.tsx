import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Student Resources — JNTUH Exams, Credits & Results Explained",
  description:
    "In-depth guides for JNTUH students: regulations, hall tickets, SGPA/CGPA, credits, supply exams, revaluation, and how to use Mana JNTUH Results responsibly.",
  alternates: { canonical: `${SITE_URL}/student-resources` },
  openGraph: {
    type: "article",
    title: "Student Resources | Mana JNTUH Results",
    description:
      "Educational articles and guidance for JNTUH students on results, credits, and examinations.",
    url: `${SITE_URL}/student-resources`,
    siteName: "Mana JNTUH Results",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Resources | Mana JNTUH Results",
    description:
      "Guides on JNTUH regulations, results, credits, and more — for students.",
  },
};

export default function StudentResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
