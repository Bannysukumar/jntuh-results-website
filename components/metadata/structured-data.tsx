export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "JNTUH Results Portal - Mana JNTUH Results",
    "alternateName": ["Mana JNTUH Results", "JNTUH Results", "JNTUH Results Portal"],
    "url": "https://manajntuhresults.vercel.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://manajntuhresults.vercel.app/jntuhresults_md.png",
      "width": 512,
      "height": 512
    },
    "description": "JNTUH Results - Mana JNTUH Results is the official portal for checking JNTUH (Jawaharlal Nehru Technological University Hyderabad) exam results online. Get your JNTUH results for B.Tech, M.Tech, MBA, MCA, B.Pharmacy. Check JNTUH results online instantly.",
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
    "name": "JNTUH Results - Mana JNTUH Results",
    "alternateName": ["JNTUH Results", "Mana JNTUH Results", "JNTUH Results Portal"],
    "url": "https://manajntuhresults.vercel.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://manajntuhresults.vercel.app/jntuhresults_md.png",
      "width": 512,
      "height": 512
    },
    "description": "JNTUH Results - Check your JNTUH exam results online instantly! Mana JNTUH Results is the #1 portal for JNTUH results. Get JNTUH results for B.Tech, M.Tech, MBA, MCA, B.Pharmacy. Check JNTUH results by hall ticket number.",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to check JNTUH results online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To check JNTUH results online, visit Mana JNTUH Results portal at manajntuhresults.vercel.app. Enter your hall ticket number in the Academic Results section to instantly view your JNTUH results, grades, CGPA, and backlogs."
        }
      },
      {
        "@type": "Question",
        "name": "What is Mana JNTUH Results?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mana JNTUH Results is the official and fastest portal for checking JNTUH (Jawaharlal Nehru Technological University Hyderabad) exam results online. It provides instant access to JNTUH results for B.Tech, M.Tech, MBA, MCA, and B.Pharmacy courses."
        }
      },
      {
        "@type": "Question",
        "name": "How to check JNTUH results by hall ticket number?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To check JNTUH results by hall ticket number, go to the Academic Results page on Mana JNTUH Results portal, enter your hall ticket number, and click search. Your JNTUH results will be displayed instantly with all semester grades, CGPA, and backlogs."
        }
      },
      {
        "@type": "Question",
        "name": "Can I check all JNTUH semester results at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can check all JNTUH semester results at once using the Academic All Results feature on Mana JNTUH Results portal. Simply enter your hall ticket number to view results from all semesters in one place."
        }
      },
      {
        "@type": "Question",
        "name": "Is Mana JNTUH Results official?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mana JNTUH Results is the most trusted and fastest portal for checking JNTUH results online. It provides official JNTUH results data from Jawaharlal Nehru Technological University Hyderabad for all courses including B.Tech, M.Tech, MBA, MCA, and B.Pharmacy."
        }
      },
      {
        "@type": "Question",
        "name": "What courses can I check JNTUH results for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can check JNTUH results for all courses including B.Tech (Engineering), M.Tech, MBA, MCA, and B.Pharmacy. Mana JNTUH Results portal supports checking results for all UG and PG courses offered by JNTUH."
        }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

