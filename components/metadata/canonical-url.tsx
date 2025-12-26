"use client";
import { usePathname } from "next/navigation";

export default function CanonicalUrl() {
  const pathname = usePathname();
  const baseUrl = "https://manajntuhresults.vercel.app";
  
  return (
    <link rel="canonical" href={`${baseUrl}${pathname}`} />
  );
}

