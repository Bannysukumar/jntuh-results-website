export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Mana JNTUH Results Portal",
    "alternateName": "Mana JNTUH Results",
    "url": "https://manajntuhresults.vercel.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://manajntuhresults.vercel.app/jntuhresults_md.png",
      "width": 512,
      "height": 512
    },
    "description": "Mana JNTUH Results - Official portal for checking JNTUH (Jawaharlal Nehru Technological University Hyderabad) exam results online. Get your UG & PG results, CGPA, backlogs, and academic performance on Mana JNTUH Results.",
    "sameAs": [
      "https://github.com/Bannysukumar",
      "https://www.linkedin.com/in/adepusukumar",
      "https://www.instagram.com/hacking_with_banny"
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
    "logo": {
      "@type": "ImageObject",
      "url": "https://manajntuhresults.vercel.app/jntuhresults_md.png",
      "width": 512,
      "height": 512
    },
    "description": "Mana JNTUH Results - Check your JNTUH exam results online instantly! Get your JNTUH results for UG & PG courses including B.Tech, M.Tech, MBA, MCA, B.Pharmacy on Mana JNTUH Results portal.",
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

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Main Navigation",
    "url": "https://manajntuhresults.vercel.app",
    "hasPart": [
      {
        "@type": "SiteNavigationElement",
        "name": "Academic Result",
        "url": "https://manajntuhresults.vercel.app/academicresult",
        "description": "Access your overall academic performance with just a hall ticket"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "All Results",
        "url": "https://manajntuhresults.vercel.app/academicallresult",
        "description": "View all semester results"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Backlog Report",
        "url": "https://manajntuhresults.vercel.app/backlogreport",
        "description": "Access your overall backlogs report with a hall ticket"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Class Results",
        "url": "https://manajntuhresults.vercel.app/classresult",
        "description": "View the results of your classmates and compare your performance"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Credit Checker",
        "url": "https://manajntuhresults.vercel.app/creditchecker",
        "description": "Check your credits to find out how many you need to move on to the next year or to graduate"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Grace Marks Eligibility",
        "url": "https://manajntuhresults.vercel.app/grace-marks/eligibility",
        "description": "Check if you are eligible for grace marks based on your academic performance"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Syllabus",
        "url": "https://manajntuhresults.vercel.app/syllabus",
        "description": "Access detailed syllabus subject wise for your academic year"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Jobs & Careers",
        "url": "https://manajntuhresults.vercel.app/carrers",
        "description": "Explore career paths, find internships, jobs and kickstart your professional journey"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Notifications",
        "url": "https://manajntuhresults.vercel.app/notifications",
        "description": "Get all the latest notifications from JNTUH"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Help Center",
        "url": "https://manajntuhresults.vercel.app/helpcenter",
        "description": "Get help and support for using Mana JNTUH Results portal"
      }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Mana JNTUH Results - Main Features",
    "description": "Key features and pages available on Mana JNTUH Results portal",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Academic Result",
        "url": "https://manajntuhresults.vercel.app/academicresult",
        "description": "Check your overall academic performance with hall ticket number"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "All Results",
        "url": "https://manajntuhresults.vercel.app/academicallresult",
        "description": "View all semester results in one place"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Backlog Report",
        "url": "https://manajntuhresults.vercel.app/backlogreport",
        "description": "Get detailed backlog report for all semesters"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Class Results",
        "url": "https://manajntuhresults.vercel.app/classresult",
        "description": "Compare your results with classmates"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Credit Checker",
        "url": "https://manajntuhresults.vercel.app/creditchecker",
        "description": "Check credits required for graduation"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Grace Marks",
        "url": "https://manajntuhresults.vercel.app/grace-marks/eligibility",
        "description": "Check grace marks eligibility and get proof documents"
      },
      {
        "@type": "ListItem",
        "position": 7,
        "name": "Syllabus",
        "url": "https://manajntuhresults.vercel.app/syllabus",
        "description": "Access detailed syllabus for all courses"
      },
      {
        "@type": "ListItem",
        "position": 8,
        "name": "Jobs & Careers",
        "url": "https://manajntuhresults.vercel.app/carrers",
        "description": "Find internships and job opportunities"
      },
      {
        "@type": "ListItem",
        "position": 9,
        "name": "Notifications",
        "url": "https://manajntuhresults.vercel.app/notifications",
        "description": "Latest JNTUH notifications and updates"
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

