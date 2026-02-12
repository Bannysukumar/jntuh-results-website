import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

const HOME_TITLE = "⚡ JNTUH Results 2025 – BTech, BPharmacy, RCRV | Mana JNTUH Results";
const HOME_DESCRIPTION =
  "Check JNTUH results 2025, JNTUH BTech results, RCRV, and supply results online. Mana JNTUH Results – official portal for JNTUH exam results, grades, CGPA, backlogs. Academic Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Notifications.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [
    "jntuh results",
    "jntuh results 2025",
    "jntuh btech results",
    "jntuh rcrv results",
    "jntuh supply results",
    "mana jntuh results",
    "jntuh exam results",
    "jntuh results online",
    "jntuh bpharmacy results",
    "jntuh mtech results",
    "jntuh mba results",
    "jntuh mca results",
    "jntuh academic results",
    "jntuh backlog report",
    "jntuh all semester results",
    "jntuh results r18",
    "jntuh results r16",
    "jawaharlal nehru technological university hyderabad results",
  ],
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: "JNTUH RESULTS",
    type: "website",
    locale: "en_US",
    images: [
      { url: `${SITE_URL}/jntuhresults_md.png`, width: 512, height: 512, alt: "JNTUH RESULTS Logo" },
      { url: `${SITE_URL}/icon-512x512.png`, width: 512, height: 512, alt: "JNTUH RESULTS Icon" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
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
