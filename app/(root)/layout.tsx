import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mana JNTUH Results - Check Your UG & PG Exam Results Online",
  description:
    "Check JNTUH Results online instantly! Get your JNTUH exam results for UG & PG courses including B.Tech, M.Tech, MBA, MCA, B.Pharmacy. View grades, CGPA, backlogs, and academic performance. Official JNTUH results portal for Jawaharlal Nehru Technological University Hyderabad.",
  keywords: [
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
    "jntuh result portal"
  ],
  openGraph: {
    title: "Mana JNTUH Results - Check Your UG & PG Exam Results Online",
    description: "Check JNTUH Results online instantly! Get your JNTUH exam results for UG & PG courses. View grades, CGPA, backlogs, and academic performance.",
    url: "https://manajntuhresults.vercel.app",
    siteName: "Mana JNTUH Results",
    images: [
      {
        url: "https://raw.githubusercontent.com/ThilakReddyy/JNTUHRESULTS-WEB/main/public/FrontPage.png",
        width: 1200,
        height: 630,
        alt: "JNTUH Results - Check Your Exam Results Online",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mana JNTUH Results - Check Your UG & PG Exam Results Online",
    description: "Check JNTUH Results online instantly! Get your JNTUH exam results for UG & PG courses. View grades, CGPA, backlogs, and academic performance.",
    images: ["https://raw.githubusercontent.com/ThilakReddyy/JNTUHRESULTS-WEB/main/public/FrontPage.png"],
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
