"use client";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/seo";

export default function CanonicalUrl() {
  const pathname = usePathname();
  const canonical = pathname ? `${SITE_URL}${pathname}` : SITE_URL;
  return <link rel="canonical" href={canonical} />;
}

