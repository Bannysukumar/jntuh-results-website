import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JNTUH Results | Mana JNTUH Results - Check JNTUH Exam Results Online 2024",
  description:
    "JNTUH Results - Check your JNTUH exam results online instantly! Mana JNTUH Results is the #1 portal for JNTUH results. Get JNTUH results for B.Tech, M.Tech, MBA, MCA, B.Pharmacy. View grades, CGPA, backlogs instantly. Access Academic Results, All Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Jobs & Careers. Official JNTUH Results portal for Jawaharlal Nehru Technological University Hyderabad.",
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
    title: "JNTUH Results | Mana JNTUH Results - Check JNTUH Exam Results Online",
    description: "JNTUH Results - Check your JNTUH exam results online instantly! Mana JNTUH Results is the fastest and most reliable portal for checking JNTUH results. Get JNTUH results for B.Tech, M.Tech, MBA, MCA, B.Pharmacy. View grades, CGPA, backlogs instantly. Access Academic Results, All Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Jobs & Careers.",
    url: "https://manajntuhresults.vercel.app",
    siteName: "JNTUH Results - Mana JNTUH Results",
    images: [
      {
        url: "https://manajntuhresults.vercel.app/jntuhresults_md.png",
        width: 512,
        height: 512,
        alt: "Mana JNTUH Results Logo",
      },
      {
        url: "https://manajntuhresults.vercel.app/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Mana JNTUH Results Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JNTUH Results | Mana JNTUH Results - Check JNTUH Exam Results Online",
    description: "JNTUH Results - Check your JNTUH exam results online instantly! Mana JNTUH Results is the #1 portal for JNTUH results. Get JNTUH results for B.Tech, M.Tech, MBA, MCA, B.Pharmacy. View grades, CGPA, backlogs instantly. Access Academic Results, All Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Jobs & Careers.",
    images: ["https://manajntuhresults.vercel.app/jntuhresults_md.png", "https://manajntuhresults.vercel.app/icon-512x512.png"],
  },
  alternates: {
    canonical: "https://manajntuhresults.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="animate-blur-fade ">{children}</div>;
}
