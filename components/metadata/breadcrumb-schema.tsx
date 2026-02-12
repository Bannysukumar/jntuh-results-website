"use client";

import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/seo";

/** Human-readable labels for path segments (for BreadcrumbList). */
const SEGMENT_NAMES: Record<string, string> = {
  academicresult: "Academic Result",
  academicallresult: "All Results",
  backlogreport: "Backlog Report",
  classresult: "Class Result",
  creditchecker: "Credits Checker",
  resultcontrast: "Result Contrast",
  "grace-marks": "Grace Marks",
  eligibility: "Grace Marks Eligibility",
  proof: "Grace Marks Proof",
  calendars: "Calendars",
  syllabus: "Syllabus",
  carrers: "Jobs & Careers",
  notifications: "Notifications",
  helpcenter: "Help Center",
  faq: "FAQ",
  "group-chat": "Group Chat",
  privacy: "Privacy Policy",
  result: "Result",
};

function buildBreadcrumb(pathname: string): { name: string; item: string }[] {
  if (!pathname || pathname === "/") {
    return [{ name: "Home", item: SITE_URL }];
  }
  const segments = pathname.split("/").filter(Boolean);
  const items: { name: string; item: string }[] = [
    { name: "Home", item: SITE_URL },
  ];
  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    const name = SEGMENT_NAMES[segment] || segment.replace(/-/g, " ");
    items.push({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      item: `${SITE_URL}${path}`,
    });
  }
  return items;
}

export default function BreadcrumbSchema() {
  const pathname = usePathname();
  const items = buildBreadcrumb(pathname || "/");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.item,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
