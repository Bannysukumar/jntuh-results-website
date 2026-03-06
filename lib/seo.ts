/**
 * Central SEO config for canonical URLs, sitemap, and schema.
 * Used by metadata, sitemap, robots, and structured data.
 */
export const SITE_URL = "https://manajntuhresults.vercel.app";

/** Sitelink candidate URLs for sitemap and Quick Links (homepage). */
export const SITELINK_URLS = [
  { path: "/", name: "JNTUH Results Home" },
  { path: "/academicallresult", name: "All Results" },
  { path: "/academicresult", name: "Academic Result" },
  { path: "/backlogreport", name: "Backlog Report" },
  { path: "/classresult", name: "Class Result" },
  { path: "/creditchecker", name: "Credits Checker" },
  { path: "/resultcontrast", name: "Result Contrast" },
  { path: "/grace-marks/eligibility", name: "Grace Marks Eligibility" },
  { path: "/grace-marks/proof", name: "Grace Marks Proof" },
  { path: "/calendars", name: "Calendars" },
  { path: "/syllabus", name: "Syllabus" },
  { path: "/carrers", name: "Jobs & Careers" },
  { path: "/notifications", name: "Notifications" },
  { path: "/helpcenter", name: "Help Center" },
  { path: "/group-chat", name: "Group Chat" },
  // SEO landing pages
  { path: "/jntuh-results", name: "JNTUH Results" },
  { path: "/jntuh-btech-results", name: "JNTUH B.Tech Results" },
  { path: "/jntuh-r18-results", name: "JNTUH R18 Results" },
  { path: "/jntuh-r22-results", name: "JNTUH R22 Results" },
  { path: "/jntuh-1-1-results", name: "JNTUH 1-1 Results" },
  { path: "/jntuh-1-2-results", name: "JNTUH 1-2 Results" },
  { path: "/jntuh-2-1-results", name: "JNTUH 2-1 Results" },
  { path: "/jntuh-3-1-results", name: "JNTUH 3-1 Results" },
  { path: "/jntuh-supply-results", name: "JNTUH Supply Results" },
  { path: "/jntuh-revaluation-results", name: "JNTUH Revaluation Results" },
  { path: "/jntuh-4-1-results", name: "JNTUH 4-1 Results" },
  { path: "/jntuh-bpharmacy-results", name: "JNTUH B.Pharmacy Results" },
  { path: "/jntuh-mtech-results", name: "JNTUH M.Tech Results" },
] as const;
