import Link from "next/link";
import Footer from "@/components/footer/footer";
import { SITE_URL } from "@/lib/seo";
import { BookOpen, GraduationCap, FileText, Scale, AlertCircle } from "lucide-react";

/** Long-form editorial page — strengthens publisher value for quality / AdSense-style reviews */
export default function StudentResourcesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Student Resources — Mana JNTUH Results",
    description:
      "Educational resources for JNTUH students on results, regulations, credits, and examinations.",
    url: `${SITE_URL}/student-resources`,
    isPartOf: { "@type": "WebSite", name: "Mana JNTUH Results", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Mana JNTUH Results",
      url: SITE_URL,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <GraduationCap className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Student Resources &amp; Guides (JNTUH)
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Practical explanations for students of Jawaharlal Nehru Technological University,
            Hyderabad. This page is written for learners—not search engines—and complements our{" "}
            <Link href="/guide" className="text-blue-600 dark:text-blue-400 hover:underline">
              step-by-step guide
            </Link>{" "}
            and{" "}
            <Link href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">
              FAQ
            </Link>
            .
          </p>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-12">
          <section aria-labelledby="sec-about-portal">
            <h2 id="sec-about-portal" className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-4">
              <BookOpen className="h-7 w-7 text-blue-600 shrink-0" />
              What Mana JNTUH Results is (and is not)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Mana JNTUH Results is an <strong>independent</strong> web portal built to help students
              access and understand examination outcomes faster. We provide tools such as academic
              results, consolidated views, backlog summaries, credit checks, notifications, and
              optional grace-marks helpers. We are <strong>not</strong> affiliated with JNTUH, your
              college, or any government body. For official decisions—promotion, degree award,
              scholarships, or placements—you must rely on{" "}
              <strong>original grade cards, memos, and circulars</strong> issued by the university
              and your institution.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              When you use our tools, data is typically fetched on demand from connected services so
              you can view it in a clear layout. That does not replace the legal value of a signed
              official document. If you find a mismatch, always follow the examination branch’s
              correction process.
            </p>
          </section>

          <section aria-labelledby="sec-regulations">
            <h2 id="sec-regulations" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Regulations (R18, R22, and others)—why they matter
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              JNTUH offers several curriculum regulations over time (for example R18 and R22). Your
              regulation defines <strong>credit structure</strong>, <strong>evaluation scheme</strong>,
              and sometimes <strong>grace-mark rules</strong>. Two students in different regulations
              may have different subject codes, credit totals, or promotion criteria even if their
              branch name looks similar.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Before comparing results with friends, confirm you are on the same regulation and
              programme. Our portal aims to reflect the data returned for your hall ticket; if a
              semester is missing, it may still be under processing or not released for your batch on
              the upstream system.
            </p>
          </section>

          <section aria-labelledby="sec-hallticket">
            <h2 id="sec-hallticket" className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-4">
              <FileText className="h-7 w-7 text-blue-600 shrink-0" />
              Hall ticket number: format and privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Your hall ticket is a unique identifier printed on admit cards and often used on result
              portals. Enter it carefully—<strong>wrong digits</strong> can show another student’s
              data or fail to load. Do not share it publicly in chats or social posts; treat it like
              a roll number tied to your academic identity.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you use our site on a shared computer, close the tab after checking results and
              avoid saving screenshots in public albums. Read our{" "}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>{" "}
              for how we handle sessions and third-party services.
            </p>
          </section>

          <section aria-labelledby="sec-cgpa">
            <h2 id="sec-cgpa" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              SGPA, CGPA, and credits—in plain language
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              <strong>SGPA</strong> summarises one semester. <strong>CGPA</strong> combines multiple
              semesters according to your regulation’s rules. <strong>Credits</strong> measure how
              much weight each subject carries toward your degree requirements. Failing a high-credit
              core subject can sometimes affect your progression more than a low-credit elective.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our Credits Checker and result views help you <em>estimate</em> standing, but your
              department’s academic rules (minimum credits per year, mandatory labs, attendance, etc.)
              are final. Use our numbers to plan; use your handbook and counsellors to confirm
              eligibility.
            </p>
          </section>

          <section aria-labelledby="sec-supply">
            <h2 id="sec-supply" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Supply exams and revaluation (RC/RV)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you did not pass a subject in the regular attempt, you may appear for{" "}
              <strong>supplementary (supply)</strong> examinations when announced. Fees, timelines,
              and registration rules change each cycle—follow the official notification PDFs on JNTUH
              portals and notices from your college exam cell.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Revaluation</strong> (including RC/RV where applicable) has strict windows.
              Applying late usually means waiting for the next cycle. Our tools may show RCRV-related
              outcomes when they exist in the returned data; always keep payment receipts and
              acknowledgement slips from the university.
            </p>
          </section>

          <section aria-labelledby="sec-backlogs">
            <h2 id="sec-backlogs" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Planning around backlogs
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              A backlog means you have not yet earned a pass in a required subject. Backlogs are
              common; what matters is a realistic plan: which supplies to attempt first, how they
              interact with prerequisites, and whether your target graduation year still works.
              Our Backlog Report is meant to give a structured view—pair it with advice from your
              mentors.
            </p>
          </section>

          <section aria-labelledby="sec-official">
            <h2 id="sec-official" className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-4">
              <Scale className="h-7 w-7 text-blue-600 shrink-0" />
              Official sources you should bookmark
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Always cross-check critical information on{" "}
              <strong>university websites, examination portals, and circulars</strong> published by
              JNTUH. Colleges often mirror notices but may add internal deadlines—follow both
              your department and the university when they differ.
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Your institution’s examination cell for fee payments and hall ticket issues.</li>
              <li>
                Official JNTUH result portals for downloading provisional marks sheets when
                released.
              </li>
              <li>
                Our{" "}
                <Link href="/notifications" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Notifications
                </Link>{" "}
                section for a filtered view of many announcements in one place (still verify PDFs).
              </li>
            </ul>
          </section>

          <section
            aria-labelledby="sec-disclaimer"
            className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/30 p-6"
          >
            <h2 id="sec-disclaimer" className="flex items-center gap-2 text-xl font-bold text-amber-900 dark:text-amber-200 mb-3">
              <AlertCircle className="h-6 w-6 shrink-0" />
              Transparency for readers &amp; advertisers
            </h2>
            <p className="text-amber-950/90 dark:text-amber-100/90 text-sm leading-relaxed mb-3">
              This website may display third-party ads to support hosting and development. Ads are
              served according to our policies and Google’s programme rules. Editorial content on
              pages like this is written to genuinely help students; it is not copied from JNTUH
              handbooks verbatim and should not be treated as legal advice.
            </p>
            <p className="text-amber-950/90 dark:text-amber-100/90 text-sm leading-relaxed">
              Questions? See{" "}
              <Link href="/about" className="font-medium underline underline-offset-2">
                About
              </Link>
              ,{" "}
              <Link href="/disclaimer" className="font-medium underline underline-offset-2">
                Disclaimer
              </Link>
              , or{" "}
              <Link href="/contact" className="font-medium underline underline-offset-2">
                Contact
              </Link>
              .
            </p>
          </section>
        </div>

        <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Home
          </Link>
          <Link href="/jntuh-results" className="text-blue-600 dark:text-blue-400 hover:underline">
            JNTUH Results hub
          </Link>
          <Link href="/helpcenter" className="text-blue-600 dark:text-blue-400 hover:underline">
            Help Center
          </Link>
        </nav>
      </article>
      <Footer />
    </div>
  );
}
