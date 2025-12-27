import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeprovider/theme-provider";
import { Toaster } from "react-hot-toast";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StructuredData from "@/components/metadata/structured-data";
import CanonicalUrl from "@/components/metadata/canonical-url";
import AdminWrapper from "@/components/admin/AdminWrapper";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://manajntuhresults.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JNTUH Results | Mana JNTUH Results - Check JNTUH Exam Results Online 2024",
    template: "%s | JNTUH Results - Mana JNTUH Results"
  },
  description: "JNTUH Results - Check your JNTUH exam results online instantly! Mana JNTUH Results is the #1 portal for JNTUH results. Get JNTUH results for B.Tech, M.Tech, MBA, MCA, B.Pharmacy courses. View grades, CGPA, backlogs instantly. Access Academic Results, All Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Jobs & Careers. Official JNTUH Results portal for Jawaharlal Nehru Technological University Hyderabad.",
  keywords: [
    "jntuh results",
    "mana jntuh results",
    "jntuh results online",
    "check jntuh results",
    "jntuh exam results",
    "jntuh results 2024",
    "jntuh results portal",
    "mana jntuhresults",
    "manajntuh results",
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
    "jntuh result portal",
    "mana jntuh results website",
    "mana jntuh results check",
    "mana jntuh results portal",
    "mana jntuh btech results",
    "mana jntuh mtech results",
    "mana jntuh mba results",
    "mana jntuh mca results",
    "mana jntuh bpharmacy results",
    "mana jntuh all semester results",
    "jntuh results check online",
    "jntuh results by hall ticket",
    "jntuh results hall ticket number"
  ],
  authors: [{ name: "Adepu Sukumar" }],
  creator: "Adepu Sukumar",
  publisher: "Adepu Sukumar",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "JNTUH Results - Mana JNTUH Results",
    title: "JNTUH Results | Mana JNTUH Results - Check JNTUH Exam Results Online",
    description: "JNTUH Results - Check your JNTUH exam results online instantly! Mana JNTUH Results is the fastest and most reliable portal for checking JNTUH results. Get JNTUH results for B.Tech, M.Tech, MBA, MCA, B.Pharmacy. View grades, CGPA, backlogs instantly. Access Academic Results, All Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Jobs & Careers.",
    images: [
      {
        url: `${siteUrl}/jntuhresults_md.png`,
        width: 512,
        height: 512,
        alt: "Mana JNTUH Results Logo",
      },
      {
        url: `${siteUrl}/icon-512x512.png`,
        width: 512,
        height: 512,
        alt: "Mana JNTUH Results Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JNTUH Results | Mana JNTUH Results - Check JNTUH Exam Results Online",
    description: "JNTUH Results - Check your JNTUH exam results online instantly! Mana JNTUH Results is the #1 portal for JNTUH results. Get JNTUH results for B.Tech, M.Tech, MBA, MCA, B.Pharmacy. View grades, CGPA, backlogs instantly. Access Academic Results, All Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Jobs & Careers.",
    images: [`${siteUrl}/jntuhresults_md.png`, `${siteUrl}/icon-512x512.png`],
    creator: "@Bannysukumar",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "19aqihOrD-qf3lECIogsri3a8H8WCd2piEQ7xdq2Akg",
  },
  category: "Education",
  classification: "University Results Portal",
  other: {
    "application-name": "JNTUH Results - Mana JNTUH Results",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad",
    "geo.position": "17.3850;78.4867",
    "ICBM": "17.3850, 78.4867",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" href="/icon-512x512.png" type="image/png" sizes="512x512" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Delicious+Handrawn&family=Inter:wght@300&family=Roboto+Slab&display=swap"
          rel="stylesheet"
        />
        <CanonicalUrl />
        <StructuredData />
      </head>
      <GoogleAnalytics />
      <body className={inter.className}>
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AdminWrapper>
            {children}
          </AdminWrapper>
          <div className=" md:block">
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
