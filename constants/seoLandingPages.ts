import { SITE_URL } from "@/lib/seo";

export type SeoLandingSlug =
  | "jntuh-results"
  | "jntuh-btech-results"
  | "jntuh-r18-results"
  | "jntuh-r22-results"
  | "jntuh-1-1-results"
  | "jntuh-1-2-results"
  | "jntuh-2-1-results"
  | "jntuh-3-1-results"
  | "jntuh-supply-results"
  | "jntuh-revaluation-results"
  | "jntuh-4-1-results"
  | "jntuh-bpharmacy-results"
  | "jntuh-mtech-results";

export interface SeoLandingPageConfig {
  slug: SeoLandingSlug;
  path: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  howToTitle: string;
  howToSteps: string[];
  aboutTitle: string;
  aboutParagraphs: string[];
  resultCtaLabel: string;
  resultCtaHref: string;
  faqTitle?: string;
  faqs?: { question: string; answer: string }[];
  relatedSlugs: SeoLandingSlug[];
}

export const SEO_LANDING_PAGES: Record<SeoLandingSlug, SeoLandingPageConfig> = {
  "jntuh-results": {
    slug: "jntuh-results",
    path: "/jntuh-results",
    metaTitle: "JNTUH Results 2025 – All Semesters & Branches | Mana JNTUH Results",
    metaDescription:
      "Check all JNTUH results 2025 in one place – B.Tech, B.Pharmacy, M.Tech, MBA, MCA and more. Fast, mobile-friendly JNTUH results portal with academic, backlog and class results.",
    h1: "JNTUH Results 2025 – All Courses & Semesters",
    intro: [
      "This page is your starting point for all JNTUH results. Whether you are a B.Tech, B.Pharmacy, M.Tech, MBA or MCA student, you can quickly navigate to the correct JNTUH result tool from here.",
      "Mana JNTUH Results connects you to academic results, all-semester consolidated reports, backlog reports, class-wise results and more, using your original hall ticket number.",
    ],
    howToTitle: "How to Check JNTUH Results Online",
    howToSteps: [
      "Click on the result tool that matches what you need – Academic Result, All Results, Backlog Report or Class Result.",
      "Enter your 10-digit JNTUH hall ticket number carefully (for example: 21XXXXXXXX).",
      "Submit the form and wait a few seconds while we fetch data from the official JNTUH servers.",
      "View or download your result safely from your mobile or desktop device.",
    ],
    aboutTitle: "About JNTUH Results on Mana JNTUH Results",
    aboutParagraphs: [
      "JNTUH publishes results regulation-wise and semester-wise. During peak result days, the official site may be slow. Mana JNTUH Results helps you access the same results using a clean and fast interface.",
      "We do not modify your marks or grades. All data is fetched directly from official JNTUH result servers and only presented in a more student-friendly way.",
    ],
    resultCtaLabel: "Go to Academic Result Search",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH Results – Frequently Asked Questions",
    faqs: [
      {
        question: "Which JNTUH results can I check from this page?",
        answer:
          "From this page you can navigate to Academic Result, All-Semester Result, Backlog Report, Class Result, Credit Checker, Grace Marks tools and more. Each tool uses your hall ticket number to fetch official JNTUH data.",
      },
      {
        question: "Are these JNTUH results official?",
        answer:
          "Yes. Mana JNTUH Results uses the same official JNTUH result APIs and endpoints. We only present the information in a faster and more user-friendly interface.",
      },
    ],
    relatedSlugs: [
      "jntuh-btech-results",
      "jntuh-supply-results",
      "jntuh-revaluation-results",
      "jntuh-r18-results",
      "jntuh-r22-results",
    ],
  },
  "jntuh-btech-results": {
    slug: "jntuh-btech-results",
    path: "/jntuh-btech-results",
    metaTitle: "JNTUH B.Tech Results 2025 – R18, R22 Regular & Supply | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH B.Tech results 2025 for R18 and R22 regulations – regular and supply. Fast B.Tech JNTUH results with academic, all-semester and backlog views.",
    h1: "JNTUH B.Tech Results – R18 & R22",
    intro: [
      "This page is dedicated to JNTUH B.Tech students who want a single place to understand and check their semester-wise results.",
      "Whether you belong to R18 or R22 regulations, you can use our Academic Result and All Results tools to see your current semester performance and complete history.",
    ],
    howToTitle: "How to Check JNTUH B.Tech Results",
    howToSteps: [
      "Keep your JNTUH B.Tech hall ticket number ready.",
      "Click on the Academic Result or All Results tool from this page.",
      "Enter your hall ticket number exactly as printed on your ID card or hall ticket.",
      "Submit and wait a few seconds to view your B.Tech results for the selected regulation and semester.",
    ],
    aboutTitle: "About JNTUH B.Tech Result Tools",
    aboutParagraphs: [
      "B.Tech results are released regulation-wise (R18, R22) and semester-wise (1-1, 1-2, 2-1, 2-2, 3-1, 3-2, 4-1, 4-2). Our tools help you navigate this easily without confusion.",
      "Using the same hall ticket number, you can also check backlogs, compare class results and verify grace marks eligibility from other sections of the site.",
    ],
    resultCtaLabel: "Check B.Tech Academic Result",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH B.Tech Results – FAQs",
    faqs: [
      {
        question: "Can I see all my B.Tech semester results at once?",
        answer:
          "Yes. Use the All Results tool to view all your B.Tech semester results in a single consolidated view for easier analysis.",
      },
      {
        question: "Does this page support both R18 and R22?",
        answer:
          "Yes. As long as your hall ticket number is valid, the tools will fetch the correct regulation and semester data from official JNTUH servers.",
      },
    ],
    relatedSlugs: [
      "jntuh-results",
      "jntuh-r18-results",
      "jntuh-r22-results",
      "jntuh-supply-results",
    ],
  },
  "jntuh-r18-results": {
    slug: "jntuh-r18-results",
    path: "/jntuh-r18-results",
    metaTitle: "JNTUH R18 Results – B.Tech & B.Pharmacy | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH R18 results for B.Tech and B.Pharmacy – all semesters, regular and supply. Fast access to R18 JNTUH results, backlogs and class-wise performance.",
    h1: "JNTUH R18 Results – All Semesters",
    intro: [
      "R18 is one of the most common regulations for JNTUH B.Tech and B.Pharmacy students. This page focuses on helping R18 students quickly reach the right result tools.",
      "From here you can jump to Academic Result, All Results and Backlog Report tools that fully support R18 regulation results.",
    ],
    howToTitle: "How to Check JNTUH R18 Results",
    howToSteps: [
      "Identify your regulation as R18 from your college or official documents.",
      "Click on the Academic Result or All Results section from this page.",
      "Enter your hall ticket number and submit.",
      "View your R18 results semester-wise, including regular and supply attempts.",
    ],
    aboutTitle: "Understanding JNTUH R18 Results",
    aboutParagraphs: [
      "Under R18 regulation, grading patterns, credit requirements and pass criteria are defined clearly by JNTUH. Our tools only fetch and display what JNTUH publishes.",
      "You can also combine R18 result information with our Credit Checker, Grace Marks and Backlog Report tools to plan your academics better.",
    ],
    resultCtaLabel: "Open R18 Academic Result Search",
    resultCtaHref: "/academicresult",
    faqTitle: "R18 Results – FAQs",
    faqs: [
      {
        question: "How do I confirm that I am an R18 student?",
        answer:
          "Usually your hall ticket, college notifications or exam timetables mention the regulation. If your batch started around 2018, you are likely under R18.",
      },
    ],
    relatedSlugs: [
      "jntuh-btech-results",
      "jntuh-results",
      "jntuh-1-1-results",
      "jntuh-1-2-results",
      "jntuh-2-1-results",
    ],
  },
  "jntuh-r22-results": {
    slug: "jntuh-r22-results",
    path: "/jntuh-r22-results",
    metaTitle: "JNTUH R22 Results – Latest B.Tech Regulation | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH R22 results for B.Tech – latest regulation, regular and supply exams. View R22 JNTUH results, backlogs and credits in one place.",
    h1: "JNTUH R22 Results – Latest Regulation",
    intro: [
      "R22 is the newer regulation introduced by JNTUH for B.Tech students. This page is tailored for R22 batches who want a clear path to their semester results.",
      "Use our result tools to track every R22 semester, including regular and supplementary exams, without confusion.",
    ],
    howToTitle: "How to Check JNTUH R22 Results",
    howToSteps: [
      "Confirm that your batch follows the R22 regulation.",
      "Use the Academic Result or All Results tools linked from this page.",
      "Enter your hall ticket number and submit the form.",
      "Review your subject-wise grades, SGPA and overall academic standing.",
    ],
    aboutTitle: "About JNTUH R22 Regulation Results",
    aboutParagraphs: [
      "R22 brings updated syllabus structures and evaluation patterns. Our platform simply fetches what JNTUH publishes and presents it neatly for students.",
      "If you are in R22, make sure to regularly track your credits and backlogs using the Credits Checker and Backlog Report tools.",
    ],
    resultCtaLabel: "Check R22 Academic Result",
    resultCtaHref: "/academicresult",
    faqTitle: "R22 Results – FAQs",
    faqs: [
      {
        question: "Are R22 results supported for all branches?",
        answer:
          "Yes. As long as JNTUH has published the result for your branch and semester, our tools can fetch and display it for you.",
      },
    ],
    relatedSlugs: [
      "jntuh-btech-results",
      "jntuh-results",
      "jntuh-1-1-results",
      "jntuh-1-2-results",
      "jntuh-2-1-results",
    ],
  },
  "jntuh-1-1-results": {
    slug: "jntuh-1-1-results",
    path: "/jntuh-1-1-results",
    metaTitle: "JNTUH 1-1 Results – First Year First Semester | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH 1-1 results for B.Tech and B.Pharmacy. First year first semester regular and supply results with fast, mobile-friendly access.",
    h1: "JNTUH 1-1 Results – First Year, First Semester",
    intro: [
      "The first semester (1-1) is very important for any JNTUH student. This page helps you quickly access JNTUH 1-1 results without confusion.",
      "Use the links below to open the Academic Result tool and check your first semester performance.",
    ],
    howToTitle: "How to Check JNTUH 1-1 Results",
    howToSteps: [
      "Click on the Academic Result tool from this page.",
      "Enter your hall ticket number and submit the form.",
      "Select the appropriate exam (regular or supply) if required.",
      "View your subject-wise marks and total SGPA for 1-1.",
    ],
    aboutTitle: "About JNTUH 1-1 Results",
    aboutParagraphs: [
      "1-1 results set the foundation for your entire degree. Tracking your performance early helps you plan improvements and avoid backlogs.",
      "You can revisit this page whenever new 1-1 regular or supply results are released by JNTUH.",
    ],
    resultCtaLabel: "Open 1-1 Academic Result Tool",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH 1-1 Results – FAQs",
    faqs: [
      {
        question: "Can I see both regular and supply 1-1 results here?",
        answer:
          "Yes. Once JNTUH publishes the supply result, you can use the same Academic Result tool to check your updated marks.",
      },
    ],
    relatedSlugs: [
      "jntuh-1-2-results",
      "jntuh-btech-results",
      "jntuh-r18-results",
      "jntuh-r22-results",
      "jntuh-results",
    ],
  },
  "jntuh-1-2-results": {
    slug: "jntuh-1-2-results",
    path: "/jntuh-1-2-results",
    metaTitle: "JNTUH 1-2 Results – First Year Second Semester | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH 1-2 results for first year second semester – regular and supply. Fast access to 1-2 JNTUH results, backlogs and credits.",
    h1: "JNTUH 1-2 Results – First Year, Second Semester",
    intro: [
      "This page is focused on JNTUH 1-2 results for first year students. You can quickly access your second semester performance from here.",
      "Use our tools to view subject-wise marks, SGPA and overall progress at the end of your first year.",
    ],
    howToTitle: "How to Check JNTUH 1-2 Results",
    howToSteps: [
      "Navigate to the Academic Result tool using the button below.",
      "Enter your hall ticket number carefully.",
      "Submit and wait a few seconds while the result is fetched from JNTUH.",
      "Review your 1-2 semester performance and note any backlogs to clear in future exams.",
    ],
    aboutTitle: "About JNTUH 1-2 Semester Results",
    aboutParagraphs: [
      "1-2 completes your first year at JNTUH. Combining 1-1 and 1-2 results gives you a clear picture of your starting academic position.",
      "From here, you can also move on to higher semester result tools like 2-1 and 2-2 as your course progresses.",
    ],
    resultCtaLabel: "Open 1-2 Academic Result Tool",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH 1-2 Results – FAQs",
    faqs: [
      {
        question: "Do I need a different hall ticket number for 1-2?",
        answer:
          "No. The same JNTUH hall ticket number is used for all semesters including 1-1 and 1-2. Just make sure you enter it correctly.",
      },
    ],
    relatedSlugs: [
      "jntuh-1-1-results",
      "jntuh-2-1-results",
      "jntuh-btech-results",
      "jntuh-results",
    ],
  },
  "jntuh-2-1-results": {
    slug: "jntuh-2-1-results",
    path: "/jntuh-2-1-results",
    metaTitle: "JNTUH 2-1 Results – Second Year First Semester | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH 2-1 results for B.Tech and B.Pharmacy – regular and supply. Track your second year first semester performance easily.",
    h1: "JNTUH 2-1 Results – Second Year, First Semester",
    intro: [
      "The 2-1 semester is where core engineering subjects start to become more intensive. This page helps you directly reach your JNTUH 2-1 results.",
      "Use our Academic Result and All Results tools to monitor your progress in the second year.",
    ],
    howToTitle: "How to Check JNTUH 2-1 Results",
    howToSteps: [
      "Click the result search button below to open the Academic Result tool.",
      "Enter your 10-digit hall ticket number and submit.",
      "Once the page loads, verify you are viewing the correct 2-1 exam session.",
      "Save or screenshot your result for future reference.",
    ],
    aboutTitle: "About JNTUH 2-1 Results",
    aboutParagraphs: [
      "2-1 results usually include several core subjects that heavily influence your CGPA. Monitoring these results early helps you balance future semesters.",
      "You can also combine 2-1 data with our Credit Checker, Backlog Report and Grace Marks tools to understand your academic position.",
    ],
    resultCtaLabel: "Open 2-1 Academic Result Tool",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH 2-1 Results – FAQs",
    faqs: [
      {
        question: "Can I see my backlogs from earlier semesters here?",
        answer:
          "For a full view of backlogs across all semesters, use the Backlog Report tool. 2-1 results by themselves will only show that specific exam.",
      },
    ],
    relatedSlugs: [
      "jntuh-1-2-results",
      "jntuh-3-1-results",
      "jntuh-results",
      "jntuh-btech-results",
    ],
  },
  "jntuh-3-1-results": {
    slug: "jntuh-3-1-results",
    path: "/jntuh-3-1-results",
    metaTitle: "JNTUH 3-1 Results – Third Year First Semester | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH 3-1 results for third year first semester. Track your 3-1 performance, backlogs and progress towards final year.",
    h1: "JNTUH 3-1 Results – Third Year, First Semester",
    intro: [
      "By 3-1, most students are deep into core subjects and electives. This page focuses on helping you quickly check your JNTUH 3-1 results.",
      "Use the result tools from here to see how you are progressing towards your final year and graduation requirements.",
    ],
    howToTitle: "How to Check JNTUH 3-1 Results",
    howToSteps: [
      "Use the button below to open the Academic Result tool.",
      "Enter your hall ticket number and submit.",
      "Confirm that the exam session and semester shown correspond to 3-1.",
      "Analyze your grades and identify any subjects that might need improvement next semester.",
    ],
    aboutTitle: "About JNTUH 3-1 Semester Results",
    aboutParagraphs: [
      "3-1 is often a turning point where students start focusing on placements, higher studies and internships. Strong 3-1 performance improves your overall profile.",
      "Make use of our other tools like Credit Checker and Backlog Report to ensure you are on track for a smooth final year.",
    ],
    resultCtaLabel: "Open 3-1 Academic Result Tool",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH 3-1 Results – FAQs",
    faqs: [
      {
        question: "Do 3-1 marks affect my final CGPA?",
        answer:
          "Yes. All semester results including 3-1 contribute to your final CGPA as per JNTUH regulations. Tracking them early helps you plan better.",
      },
    ],
    relatedSlugs: [
      "jntuh-2-1-results",
      "jntuh-results",
      "jntuh-btech-results",
      "jntuh-supply-results",
    ],
  },
  "jntuh-supply-results": {
    slug: "jntuh-supply-results",
    path: "/jntuh-supply-results",
    metaTitle: "JNTUH Supply Results – Supplementary Exams | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH supply results for B.Tech, B.Pharmacy and other courses. Track supplementary exam performance and backlog clearance status.",
    h1: "JNTUH Supply Results – Supplementary Examinations",
    intro: [
      "If you have appeared for JNTUH supplementary exams, this page helps you understand how to track your supply results.",
      "Mana JNTUH Results allows you to see updated marks after supply exams and monitor which backlogs are cleared.",
    ],
    howToTitle: "How to Check JNTUH Supply Results",
    howToSteps: [
      "Use the Academic Result tool to fetch your latest result using your hall ticket number.",
      "Check whether the exam session indicates a supplementary attempt.",
      "Compare your previous result with the latest one to confirm backlog clearance.",
      "Optionally, use the Backlog Report tool to see a consolidated view of all remaining subjects.",
    ],
    aboutTitle: "About JNTUH Supplementary Results",
    aboutParagraphs: [
      "Supply exams are a chance to clear backlogs without losing an academic year. Our platform helps you quickly verify whether your backlog has been cleared in the latest attempt.",
      "We always fetch data from official JNTUH servers, so the status you see here matches the university records.",
    ],
    resultCtaLabel: "Check Latest Supply Result",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH Supply Results – FAQs",
    faqs: [
      {
        question: "How do I know if a backlog is cleared?",
        answer:
          "If a previously failed subject now shows a passing grade in your recent result, that backlog is considered cleared. You can also verify this using the Backlog Report tool.",
      },
    ],
    relatedSlugs: [
      "jntuh-results",
      "jntuh-btech-results",
      "jntuh-revaluation-results",
      "jntuh-r18-results",
    ],
  },
  "jntuh-revaluation-results": {
    slug: "jntuh-revaluation-results",
    path: "/jntuh-revaluation-results",
    metaTitle: "JNTUH Revaluation Results (RCRV) – Recounting & Revaluation | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH revaluation (RCRV) results for B.Tech, B.Pharmacy and other courses. Track recounting, revaluation and challenge valuation status online.",
    h1: "JNTUH Revaluation Results – RCRV & Recounting",
    intro: [
      "If you applied for recounting or revaluation (RCRV) of your JNTUH exam papers, this page explains how to verify the updated results.",
      "Revaluation results can change your marks and impact backlogs, so it is important to check them carefully using your hall ticket number.",
    ],
    howToTitle: "How to Check JNTUH Revaluation Results",
    howToSteps: [
      "Wait for the official JNTUH notification that revaluation results are released.",
      "Use the Academic Result tool linked below and enter your hall ticket number.",
      "Verify if the result page mentions RCRV or revaluation status for the subjects you applied for.",
      "Compare the new marks with your previous result and check if any backlogs are now cleared.",
    ],
    aboutTitle: "About JNTUH Revaluation (RCRV) Process",
    aboutParagraphs: [
      "Revaluation allows students to request re-checking of their answer scripts if they believe there is a valuation mistake. JNTUH publishes updated results after processing these requests.",
      "Our portal helps you quickly verify whether your marks have increased, decreased or remained the same after revaluation.",
    ],
    resultCtaLabel: "Check Latest Revaluation Result",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH Revaluation Results – FAQs",
    faqs: [
      {
        question: "Will revaluation always increase my marks?",
        answer:
          "No. Revaluation can increase, decrease or keep your marks unchanged. You should apply only if you strongly believe there is a valuation error.",
      },
    ],
    relatedSlugs: [
      "jntuh-supply-results",
      "jntuh-results",
      "jntuh-btech-results",
      "jntuh-bpharmacy-results",
    ],
  },
  "jntuh-4-1-results": {
    slug: "jntuh-4-1-results",
    path: "/jntuh-4-1-results",
    metaTitle: "JNTUH 4-1 Results – Final Year First Semester | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH 4-1 results for final year first semester. Track your 4-1 performance, backlogs and CGPA before graduation.",
    h1: "JNTUH 4-1 Results – Final Year, First Semester",
    intro: [
      "The 4-1 semester is a crucial stage in JNTUH where students get closer to graduation, placements and higher studies. This page is dedicated to helping you quickly check your JNTUH 4-1 results.",
      "Use our Academic Result and All Results tools to see how your 4-1 performance contributes to your final CGPA and graduation eligibility.",
    ],
    howToTitle: "How to Check JNTUH 4-1 Results",
    howToSteps: [
      "Click the result search button below to open the Academic Result tool.",
      "Enter your 10-digit JNTUH hall ticket number and submit.",
      "Confirm that the exam session and semester correspond to 4-1.",
      "Review your subject-wise grades and note any subjects that may need attention before 4-2 or supply exams.",
    ],
    aboutTitle: "About JNTUH 4-1 Semester Results",
    aboutParagraphs: [
      "4-1 usually contains important core and elective subjects that significantly influence your final CGPA. Monitoring your 4-1 result early helps you plan for placements and higher studies.",
      "You can combine your 4-1 result data with tools like Credit Checker, Backlog Report and Grace Marks Eligibility to understand your exact academic status before graduation.",
    ],
    resultCtaLabel: "Open 4-1 Academic Result Tool",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH 4-1 Results – FAQs",
    faqs: [
      {
        question: "Does my 4-1 result affect eligibility for placements?",
        answer:
          "Yes. Many companies consider your aggregate CGPA up to the latest semester including 4-1. Tracking your 4-1 result helps you know where you stand before campus placements.",
      },
    ],
    relatedSlugs: [
      "jntuh-3-1-results",
      "jntuh-btech-results",
      "jntuh-results",
      "jntuh-supply-results",
    ],
  },
  "jntuh-bpharmacy-results": {
    slug: "jntuh-bpharmacy-results",
    path: "/jntuh-bpharmacy-results",
    metaTitle: "JNTUH B.Pharmacy Results – R18, R22 Regular & Supply | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH B.Pharmacy results for R18 and R22 regulations – regular and supply. Fast B.Pharmacy JNTUH results with academic and backlog views.",
    h1: "JNTUH B.Pharmacy Results – All Semesters",
    intro: [
      "This page is designed specifically for JNTUH B.Pharmacy students who want a clear and simple way to access their semester-wise results.",
      "Using your hall ticket number, you can quickly open Academic Result and All Results tools to view your B.Pharmacy performance across all semesters and regulations.",
    ],
    howToTitle: "How to Check JNTUH B.Pharmacy Results",
    howToSteps: [
      "Keep your JNTUH B.Pharmacy hall ticket number ready.",
      "Click on the Academic Result or All Results tool from this page.",
      "Enter your hall ticket number exactly as printed on your college ID or hall ticket.",
      "Submit the form and wait a few seconds to see your B.Pharmacy subject-wise marks and grades.",
    ],
    aboutTitle: "About JNTUH B.Pharmacy Results",
    aboutParagraphs: [
      "JNTUH B.Pharmacy results are released semester-wise and regulation-wise, similar to B.Tech. Our tools give you a clean interface to access these results without confusion or delays.",
      "From this page, you can also navigate to other helpful tools like Backlog Report, Grace Marks Eligibility and Class Result to get a complete picture of your academic journey.",
    ],
    resultCtaLabel: "Check B.Pharmacy Academic Result",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH B.Pharmacy Results – FAQs",
    faqs: [
      {
        question: "Are B.Pharmacy results fetched from official JNTUH servers?",
        answer:
          "Yes. All B.Pharmacy results shown through Mana JNTUH Results are fetched from official JNTUH result endpoints. We only improve the speed and presentation.",
      },
    ],
    relatedSlugs: [
      "jntuh-results",
      "jntuh-btech-results",
      "jntuh-r18-results",
      "jntuh-supply-results",
    ],
  },
  "jntuh-mtech-results": {
    slug: "jntuh-mtech-results",
    path: "/jntuh-mtech-results",
    metaTitle: "JNTUH M.Tech Results – All Specializations | Mana JNTUH Results",
    metaDescription:
      "Check JNTUH M.Tech results for all specializations – regular and supply exams. Fast JNTUH M.Tech result access with a student-friendly interface.",
    h1: "JNTUH M.Tech Results – All Specializations",
    intro: [
      "Postgraduate M.Tech students at JNTUH often need a quick way to verify semester results across different specializations. This page is focused on M.Tech result access.",
      "Using your M.Tech hall ticket number, you can open the Academic Result tool and see your latest performance in a clear, responsive layout.",
    ],
    howToTitle: "How to Check JNTUH M.Tech Results",
    howToSteps: [
      "Click on the Academic Result search button below.",
      "Enter your JNTUH M.Tech hall ticket number and submit the form.",
      "Wait a few seconds while we fetch your official result from JNTUH servers.",
      "Review your subject-wise grades and semester performance.",
    ],
    aboutTitle: "About JNTUH M.Tech Result Access",
    aboutParagraphs: [
      "M.Tech results at JNTUH are published course-wise and semester-wise. Mana JNTUH Results helps you access these quickly without struggling with slow or overloaded servers.",
      "From here, you can also move to other tools on the site such as Notifications and Syllabus pages to stay updated about exam schedules and curriculum.",
    ],
    resultCtaLabel: "Check M.Tech Academic Result",
    resultCtaHref: "/academicresult",
    faqTitle: "JNTUH M.Tech Results – FAQs",
    faqs: [
      {
        question: "Can I use the same tool for all M.Tech branches?",
        answer:
          "Yes. As long as your hall ticket number is valid, the Academic Result tool can fetch M.Tech results for any specialization published by JNTUH.",
      },
    ],
    relatedSlugs: [
      "jntuh-results",
      "jntuh-btech-results",
      "jntuh-revaluation-results",
    ],
  },
};

export const SEO_LANDING_PAGE_LIST: SeoLandingPageConfig[] = Object.values(SEO_LANDING_PAGES);

export function getSeoLandingConfigBySlug(slug: string): SeoLandingPageConfig | null {
  const key = slug as SeoLandingSlug;
  return SEO_LANDING_PAGES[key] ?? null;
}

