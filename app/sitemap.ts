import { MetadataRoute } from "next";
import { SITE_URL, SITELINK_URLS } from "@/lib/seo";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/academicresult": 0.95,
  "/academicallresult": 0.95,
  "/backlogreport": 0.9,
  "/classresult": 0.9,
  "/creditchecker": 0.85,
  "/resultcontrast": 0.85,
  "/grace-marks/eligibility": 0.85,
  "/grace-marks/proof": 0.85,
  "/notifications": 0.9,
  "/syllabus": 0.8,
  "/calendars": 0.8,
  "/carrers": 0.8,
  "/helpcenter": 0.7,
  "/group-chat": 0.7,
  // SEO landing pages – high priority informational entries
  "/jntuh-results": 0.95,
  "/jntuh-btech-results": 0.93,
  "/jntuh-r18-results": 0.9,
  "/jntuh-r22-results": 0.9,
  "/jntuh-1-1-results": 0.9,
  "/jntuh-1-2-results": 0.9,
  "/jntuh-2-1-results": 0.9,
  "/jntuh-3-1-results": 0.9,
  "/jntuh-supply-results": 0.9,
  "/jntuh-revaluation-results": 0.9,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const getChangeFrequency = (p: string): "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" => {
    if (p === "/" || p === "/notifications") return "daily";
    if (p === "/syllabus" || p === "/calendars") return "monthly";
    return "weekly";
  };
  return SITELINK_URLS.map(({ path }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: getChangeFrequency(path),
    priority: PRIORITY[path] ?? 0.7,
  }));
}

