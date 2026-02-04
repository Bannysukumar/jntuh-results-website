"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ADSENSE_CLIENT = "ca-pub-1589551808134823";

/**
 * Routes where AdSense is allowed (pages with substantial publisher content).
 * Per AdSense policy: No ads on screens without content, under construction,
 * or used for alerts/navigation/behavioral purposes.
 */
const CONTENT_RICH_ROUTES = [
  "/", // Home - has navigation cards and descriptions
  "/academicresult",
  "/academicallresult",
  "/classresult",
  "/creditchecker",
  "/resultcontrast",
  "/backlogreport",
  "/syllabus",
  "/carrers",
  "/faq",
  "/helpcenter",
  "/notifications",
  "/feedback",
  "/privacy",
  "/calendars",
  "/group-chat",
  "/grace-marks",
  "/saved-results",
  "/excelresult",
];

function isContentRichRoute(pathname: string | null): boolean {
  if (!pathname) return false;

  // Never show ads on admin pages
  if (pathname.startsWith("/admin")) return false;

  // Check exact match or prefix for content-rich routes
  for (const route of CONTENT_RICH_ROUTES) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return true;
    }
  }

  // Result pages (e.g. /academicallresult/result, /classresult/result) - have result content
  if (
    pathname.includes("/result") &&
    !pathname.startsWith("/admin")
  ) {
    return true;
  }

  return false;
}

/**
 * Conditionally loads AdSense only on content-rich pages.
 * Fixes AdSense policy violation: "Google-served ads on screens without publisher content"
 */
export default function AdSenseLoader() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isContentRichRoute(pathname)) return;

    // Avoid loading duplicate scripts
    const existingScript = document.querySelector(
      `script[src*="adsbygoogle.js?client=${ADSENSE_CLIENT}"]`
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    // Funding Choices (ad blocking recovery) - only on content-rich pages
    const loadFundingChoices = () => {
      if (!document.querySelector('script[src*="fundingchoicesmessages.google.com"]')) {
        const fcScript = document.createElement("script");
        fcScript.async = true;
        fcScript.src = `https://fundingchoicesmessages.google.com/i/pub-${ADSENSE_CLIENT.replace("ca-pub-", "")}?ers=1`;
        document.head.appendChild(fcScript);
      }
      if (!(window.frames as Record<string, unknown>)["googlefcPresent"] && document.body) {
        const iframe = document.createElement("iframe");
        iframe.style.cssText = "width:0;height:0;border:none;display:none";
        iframe.name = "googlefcPresent";
        document.body.appendChild(iframe);
      }
    };
    if (document.readyState === "complete") loadFundingChoices();
    else window.addEventListener("load", loadFundingChoices);
  }, [pathname]);

  return null;
}
