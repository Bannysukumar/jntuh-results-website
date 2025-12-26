import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mana JNTUH Results - Check Your UG & PG Exam Results Online",
  description:
    "Mana JNTUH Results - Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses including B.Tech, M.Tech, MBA, MCA, B.Pharmacy. View grades, CGPA, backlogs, and academic performance. Official Mana JNTUH Results portal for Jawaharlal Nehru Technological University Hyderabad.",
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
    title: "Mana JNTUH Results - Check Your UG & PG Exam Results Online",
    description: "Mana JNTUH Results - Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses. View grades, CGPA, backlogs, and academic performance on Mana JNTUH Results portal.",
    url: "https://manajntuhresults.vercel.app",
    siteName: "Mana JNTUH Results",
    images: [
      {
        url: "https://manajntuhresults.vercel.app/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Mana JNTUH Results Logo",
      },
      {
        url: "https://raw.githubusercontent.com/ThilakReddyy/JNTUHRESULTS-WEB/main/public/FrontPage.png",
        width: 1200,
        height: 630,
        alt: "Mana JNTUH Results - Check Your JNTUH Exam Results Online",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mana JNTUH Results - Check Your UG & PG Exam Results Online",
    description: "Mana JNTUH Results - Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses. View grades, CGPA, backlogs, and academic performance on Mana JNTUH Results portal.",
    images: ["https://manajntuhresults.vercel.app/icon-512x512.png", "https://raw.githubusercontent.com/ThilakReddyy/JNTUHRESULTS-WEB/main/public/FrontPage.png"],
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
