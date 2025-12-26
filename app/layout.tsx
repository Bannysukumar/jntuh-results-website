import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeprovider/theme-provider";
import Navbar from "@/components/navbar/navbar";
import SideMenubar from "@/components/sidemenubar/sidemenubar";
import { SidebarProvider } from "@/customhooks/sidebarhook";
import { Toaster } from "react-hot-toast";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { NavBarProvider } from "@/customhooks/navbarhook";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NotificationPopUp from "@/components/notifications/popup";
import StructuredData from "@/components/metadata/structured-data";
import CanonicalUrl from "@/components/metadata/canonical-url";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://manajntuhresults.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mana JNTUH Results - Check Your UG & PG Exam Results Online | Mana JNTUH Results Portal",
    template: "%s | Mana JNTUH Results"
  },
  description: "Mana JNTUH Results - Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses including B.Tech, M.Tech, MBA, MCA, B.Pharmacy. View grades, CGPA, backlogs, and academic performance. Official Mana JNTUH Results portal for Jawaharlal Nehru Technological University Hyderabad.",
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
  authors: [{ name: "Thilak Reddy" }],
  creator: "Thilak Reddy",
  publisher: "Thilak Reddy",
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
    siteName: "Mana JNTUH Results",
    title: "Mana JNTUH Results - Check Your UG & PG Exam Results Online",
    description: "Mana JNTUH Results - Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses. View grades, CGPA, backlogs, and academic performance on Mana JNTUH Results portal.",
    images: [
      {
        url: "https://raw.githubusercontent.com/ThilakReddyy/JNTUHRESULTS-WEB/main/public/FrontPage.png",
        width: 1200,
        height: 630,
        alt: "Mana JNTUH Results - Check Your JNTUH Exam Results Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mana JNTUH Results - Check Your UG & PG Exam Results Online",
    description: "Mana JNTUH Results - Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses. View grades, CGPA, backlogs, and academic performance on Mana JNTUH Results portal.",
    images: ["https://raw.githubusercontent.com/ThilakReddyy/JNTUHRESULTS-WEB/main/public/FrontPage.png"],
    creator: "@thilakreddyonly",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "2arj9D99oUuGh03Qhewo_iEY45zbwhrJqLytiZSmoEg",
  },
  category: "Education",
  classification: "University Results Portal",
  other: {
    "application-name": "Mana JNTUH Results",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
          <SidebarProvider>
            <NavBarProvider>
              <Navbar />
              <main className="pt-16">
                <SideMenubar />
                <div className="lg:ml-64">
                  <NotificationPopUp />
                  {/* <Pwa /> */}
                  {children}
                </div>
                <div className=" md:block">
                  <Toaster position="bottom-right" reverseOrder={false} />
                </div>
              </main>
            </NavBarProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
