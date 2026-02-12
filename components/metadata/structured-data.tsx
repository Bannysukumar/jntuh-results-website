import { SITE_URL } from "@/lib/seo";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JNTUH RESULTS",
    alternateName: ["JNTUH Results", "JNTUH Results Portal", "Mana JNTUH Results"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon-512x512.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/icon-512x512.png`,
    description:
      "JNTUH RESULTS - Official portal for checking JNTUH (Jawaharlal Nehru Technological University Hyderabad) exam results online. Get your UG & PG results, CGPA, backlogs, and academic performance.",
    sameAs: [
      "https://github.com/Bannysukumar",
      "https://www.linkedin.com/in/adepusukumar",
      "https://www.instagram.com/hacking_with_banny",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Technical Support",
      url: `${SITE_URL}/helpcenter`,
    },
    brand: {
      "@type": "Brand",
      name: "JNTUH RESULTS",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512x512.png`,
        width: 512,
        height: 512,
      },
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JNTUH RESULTS",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon-512x512.png`,
      width: 512,
      height: 512,
    },
    description:
      "JNTUH RESULTS - Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses including B.Tech, M.Tech, MBA, MCA, B.Pharmacy.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/academicresult?htno={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    url: SITE_URL,
    hasPart: [
      { "@type": "SiteNavigationElement", name: "All Results", url: `${SITE_URL}/academicallresult`, description: "View all semester results" },
      { "@type": "SiteNavigationElement", name: "Academic Result", url: `${SITE_URL}/academicresult`, description: "Access your overall academic performance with hall ticket" },
      { "@type": "SiteNavigationElement", name: "Backlog Report", url: `${SITE_URL}/backlogreport`, description: "Access your overall backlogs report with hall ticket" },
      { "@type": "SiteNavigationElement", name: "Class Result", url: `${SITE_URL}/classresult`, description: "View class results and compare performance" },
      { "@type": "SiteNavigationElement", name: "Credits Checker", url: `${SITE_URL}/creditchecker`, description: "Check credits required to promote or graduate" },
      { "@type": "SiteNavigationElement", name: "Result Contrast", url: `${SITE_URL}/resultcontrast`, description: "Compare performance across semesters with classmates" },
      { "@type": "SiteNavigationElement", name: "Grace Marks Eligibility", url: `${SITE_URL}/grace-marks/eligibility`, description: "Check grace marks eligibility" },
      { "@type": "SiteNavigationElement", name: "Grace Marks Proof", url: `${SITE_URL}/grace-marks/proof`, description: "Get grace marks proof document" },
      { "@type": "SiteNavigationElement", name: "Calendars", url: `${SITE_URL}/calendars`, description: "Academic calendars and exam schedules" },
      { "@type": "SiteNavigationElement", name: "Syllabus", url: `${SITE_URL}/syllabus`, description: "Access detailed syllabus subject wise" },
      { "@type": "SiteNavigationElement", name: "Jobs & Careers", url: `${SITE_URL}/carrers`, description: "Find internships and jobs" },
      { "@type": "SiteNavigationElement", name: "Notifications", url: `${SITE_URL}/notifications`, description: "Latest JNTUH notifications" },
      { "@type": "SiteNavigationElement", name: "Help Center", url: `${SITE_URL}/helpcenter`, description: "Get help and support" },
      { "@type": "SiteNavigationElement", name: "Group Chat", url: `${SITE_URL}/group-chat`, description: "Real-time group chat for students" },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "JNTUH RESULTS - Main Features",
    description: "Key features and pages available on JNTUH RESULTS portal",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "All Results", url: `${SITE_URL}/academicallresult`, description: "View all semester results" },
      { "@type": "ListItem", position: 2, name: "Academic Result", url: `${SITE_URL}/academicresult`, description: "Check academic performance with hall ticket" },
      { "@type": "ListItem", position: 3, name: "Backlog Report", url: `${SITE_URL}/backlogreport`, description: "Get backlog report for all semesters" },
      { "@type": "ListItem", position: 4, name: "Class Result", url: `${SITE_URL}/classresult`, description: "Compare results with classmates" },
      { "@type": "ListItem", position: 5, name: "Credits Checker", url: `${SITE_URL}/creditchecker`, description: "Check credits required for graduation" },
      { "@type": "ListItem", position: 6, name: "Result Contrast", url: `${SITE_URL}/resultcontrast`, description: "Compare performance across semesters" },
      { "@type": "ListItem", position: 7, name: "Grace Marks Eligibility", url: `${SITE_URL}/grace-marks/eligibility`, description: "Check grace marks eligibility" },
      { "@type": "ListItem", position: 8, name: "Grace Marks Proof", url: `${SITE_URL}/grace-marks/proof`, description: "Get grace marks proof document" },
      { "@type": "ListItem", position: 9, name: "Calendars", url: `${SITE_URL}/calendars`, description: "Academic calendars" },
      { "@type": "ListItem", position: 10, name: "Syllabus", url: `${SITE_URL}/syllabus`, description: "Access syllabus for all courses" },
      { "@type": "ListItem", position: 11, name: "Jobs & Careers", url: `${SITE_URL}/carrers`, description: "Find internships and jobs" },
      { "@type": "ListItem", position: 12, name: "Notifications", url: `${SITE_URL}/notifications`, description: "Latest JNTUH notifications" },
      { "@type": "ListItem", position: 13, name: "Help Center", url: `${SITE_URL}/helpcenter`, description: "Get help and support" },
      { "@type": "ListItem", position: 14, name: "Group Chat", url: `${SITE_URL}/group-chat`, description: "Real-time group chat" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  );
}

