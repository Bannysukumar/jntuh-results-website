export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Mana JNTUH Results Portal",
    "alternateName": "Mana JNTUH Results",
    "url": "https://manajntuhresults.vercel.app",
    "logo": "https://raw.githubusercontent.com/ThilakReddyy/JNTUHRESULTS-WEB/main/public/FrontPage.png",
    "description": "Official portal for checking JNTUH (Jawaharlal Nehru Technological University Hyderabad) exam results online. Get your UG & PG results, CGPA, backlogs, and academic performance.",
    "sameAs": [
      "https://github.com/thilakreddyy",
      "https://twitter.com/thilakreddyonly",
      "https://www.instagram.com/__thilak_reddy__/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Technical Support",
      "url": "https://manajntuhresults.vercel.app/helpcenter"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mana JNTUH Results",
    "url": "https://manajntuhresults.vercel.app",
    "description": "Check JNTUH Results online instantly! Get your JNTUH exam results for UG & PG courses including B.Tech, M.Tech, MBA, MCA, B.Pharmacy.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://manajntuhresults.vercel.app/academicresult?htno={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://manajntuhresults.vercel.app"
      }
    ]
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

