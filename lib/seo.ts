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
] as const;
