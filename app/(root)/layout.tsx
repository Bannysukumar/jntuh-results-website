import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "JNTUH Results – Check JNTUH Exam Results Online",
  description:
    "Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses including B.Tech, M.Tech, MBA, MCA, B.Pharmacy. View grades, CGPA, backlogs, and academic performance. Features: Academic Results, All Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Jobs & Careers, Notifications. Official JNTUH Results portal for Jawaharlal Nehru Technological University Hyderabad.",
  keywords: [
    "mana jntuh results",
    "mana jntuhresults",
    "manajntuh results",
    "mana jntuh results online",
    "mana jntuh results portal",
    "check mana jntuh results",
    "mana jntuh exam results",
    "jntuh results",
    "jntuh results online",
    "jntuh exam results",
    "jntuh btech results",
    "jntuh mtech results",
    "jntuh mba results",
    "jntuh mca results",
    "jntuh bpharmacy results",
    "jntuh engineering results",
    "jntuh ug results",
    "jntuh pg results",
    "jntuh all semester results",
    "jntuh results r18",
    "jntuh results r16",
    "jntuh results r15",
    "jntuh cgpa calculator",
    "jntuh backlog report",
    "jntuh academic results",
    "jntuh class results",
    "jntuh notifications",
    "jawaharlal nehru technological university hyderabad results",
    "jntuh results vercel",
    "check jntuh results",
    "jntuh result portal",
    "mana jntuh results website",
    "mana jntuh results check",
    "mana jntuh results portal",
    "mana jntuh btech results",
    "mana jntuh mtech results",
    "mana jntuh mba results",
    "mana jntuh mca results",
    "mana jntuh bpharmacy results",
    "mana jntuh all semester results"
  ],
  openGraph: {
    title: "JNTUH Results – Check JNTUH Exam Results Online",
    description: "Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses. View grades, CGPA, backlogs, and academic performance. Access Academic Results, All Results, Backlog Report, Class Results, Credit Checker, Grace Marks Eligibility, Syllabus, Jobs & Careers, and Notifications.",
    url: SITE_URL,
    siteName: "JNTUH RESULTS",
    images: [
      { url: `${SITE_URL}/jntuhresults_md.png`, width: 512, height: 512, alt: "JNTUH RESULTS Logo" },
      { url: `${SITE_URL}/icon-512x512.png`, width: 512, height: 512, alt: "JNTUH RESULTS Icon" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JNTUH Results – Check JNTUH Exam Results Online",
    description: "Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses. View grades, CGPA, backlogs, and academic performance. Access Academic Results, All Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Jobs & Careers, and Notifications.",
    images: [`${SITE_URL}/jntuhresults_md.png`, `${SITE_URL}/icon-512x512.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
    verification: {
      google: "google-site-verification=2d4d1883a5e2e03b",
      other: {
        "impact-site-verification": "595ebfea-50e4-4e69-8e54-fa5f6f1c476c",
      },
    },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="animate-blur-fade ">{children}</div>;
}
