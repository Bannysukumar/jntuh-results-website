import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeprovider/theme-provider";
import { Toaster } from "react-hot-toast";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SpeedInsightsWrapper from "@/components/analytics/SpeedInsightsWrapper";
import StructuredData from "@/components/metadata/structured-data";
import CanonicalUrl from "@/components/metadata/canonical-url";
import BreadcrumbSchema from "@/components/metadata/breadcrumb-schema";
import AdminWrapper from "@/components/admin/AdminWrapper";
import NativeInit from "@/components/native/native-init";
import OfflineIndicator from "@/components/native/offline-indicator";
import NativeNotificationHandler from "@/components/native/native-notification-handler";
import AdSenseLoader from "@/components/ads/AdSenseLoader";
import dynamic from "next/dynamic";
import { SITE_URL } from "@/lib/seo";

// Lazy load heavy components
const AIChatBot = dynamic(() => import("@/components/ai/AIChatBot"), {
  ssr: false,
});

const RealTimeNotification = dynamic(() => import("@/components/notifications/RealTimeNotification"), {
  ssr: false,
});

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "⚡ JNTUH Results 2025 – BTech, BPharmacy, RCRV | Mana JNTUH Results",
    template: "%s | JNTUH RESULTS",
  },
  description:
    "Check JNTUH results 2025, JNTUH BTech results, RCRV, and supply results online. Mana JNTUH Results – official portal for JNTUH exam results, grades, CGPA, backlogs. Academic Results, Backlog Report, Class Results, Credit Checker, Grace Marks, Syllabus, Notifications.",
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
    url: SITE_URL,
    siteName: "JNTUH RESULTS",
    title: "⚡ JNTUH Results 2025 – BTech, BPharmacy, RCRV | Mana JNTUH Results",
    description:
      "Check JNTUH results 2025, JNTUH BTech results, RCRV, and supply results online. Mana JNTUH Results – official portal for JNTUH exam results, grades, CGPA, backlogs.",
    images: [
      {
        url: `${SITE_URL}/jntuhresults_md.png`,
        width: 512,
        height: 512,
        alt: "JNTUH RESULTS Logo",
      },
      {
        url: `${SITE_URL}/icon-512x512.png`,
        width: 512,
        height: 512,
        alt: "JNTUH RESULTS Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "⚡ JNTUH Results 2025 – BTech, BPharmacy, RCRV | Mana JNTUH Results",
    description:
      "Check JNTUH results 2025, JNTUH BTech results, RCRV, and supply results online. Mana JNTUH Results – official portal for JNTUH exam results.",
    images: [`${SITE_URL}/jntuhresults_md.png`, `${SITE_URL}/icon-512x512.png`],
    creator: "@Bannysukumar",
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "19aqihOrD-qf3lECIogsri3a8H8WCd2piEQ7xdq2Akg",
  },
  category: "Education",
  classification: "University Results Portal",
  other: {
    "application-name": "JNTUH RESULTS",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
    "google-adsense-account": "ca-pub-1589551808134823",
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
        {/* Resource Hints - DNS Prefetch and Preconnect */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://fundingchoicesmessages.google.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Icons and Manifest */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" href="/icon-512x512.png" type="image/png" sizes="512x512" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="google-adsense-account" content="ca-pub-1589551808134823" />
        
        {/* Optimized Google Fonts - Load with display=swap */}
        <link
          href="https://fonts.googleapis.com/css2?family=Delicious+Handrawn&family=Inter:wght@300&family=Roboto+Slab&display=swap"
          rel="stylesheet"
        />
        {/* AdSense loads conditionally via AdSenseLoader - only on content-rich pages (AdSense policy compliance) */}
        <CanonicalUrl />
        <StructuredData />
        <BreadcrumbSchema />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <SpeedInsightsWrapper />
        <AdSenseLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NativeInit />
          <NativeNotificationHandler />
          <OfflineIndicator />
          <AdminWrapper>
            {children}
          </AdminWrapper>
          <div className=" md:block">
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
          <AIChatBot />
          <RealTimeNotification />
        </ThemeProvider>
      </body>
    </html>
  );
}
