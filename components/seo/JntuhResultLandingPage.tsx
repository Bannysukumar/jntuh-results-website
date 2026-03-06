"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, HelpCircle, Search } from "lucide-react";
import type { SeoLandingPageConfig } from "@/constants/seoLandingPages";
import { cn } from "@/lib/utils";

interface Props {
  config: SeoLandingPageConfig;
  allPages: SeoLandingPageConfig[];
}

export default function JntuhResultLandingPage({ config, allPages }: Props) {
  const relatedPages = allPages.filter((p) => config.relatedSlugs.includes(p.slug));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      {/* FAQ schema for Google Search, when FAQs are configured */}
      {config.faqTitle && config.faqs && config.faqs.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: config.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}
      <main className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        {/* Header */}
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            {config.h1}
          </h1>
          <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            {config.intro.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </header>

        {/* Result search CTA */}
        <section aria-labelledby="result-search" className="mb-10">
          <Card className="p-5 md:p-6 shadow-md bg-white/90 dark:bg-gray-900/80 border-blue-100 dark:border-blue-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="result-search" className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Check Your JNTUH Result Online
                  </h2>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Use our fast Academic Result tool to fetch your official JNTUH result using your 10-digit hall ticket number.
                  </p>
                </div>
              </div>
              <div className="flex md:flex-none">
                <Link
                  href={config.resultCtaHref}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition",
                    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  )}
                >
                  {config.resultCtaLabel}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* How to check + About */}
        <section className="grid gap-6 md:grid-cols-2 mb-10">
          <Card className="p-5 md:p-6 bg-white/90 dark:bg-gray-900/80">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {config.howToTitle}
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
              {config.howToSteps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </Card>

          <Card className="p-5 md:p-6 bg-white/90 dark:bg-gray-900/80">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {config.aboutTitle}
            </h2>
            <div className="space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
              {config.aboutParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </Card>
        </section>

        {/* Related result pages */}
        {relatedPages.length > 0 && (
          <section className="mb-10" aria-labelledby="related-pages">
            <Card className="p-5 md:p-6 bg-white/90 dark:bg-gray-900/80">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                <h2 id="related-pages" className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  Explore More JNTUH Result Pages
                </h2>
              </div>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3">
                Use these quick links to open other popular JNTUH result tools and semester-specific pages.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedPages.map((page) => (
                  <Link
                    key={page.path}
                    href={page.path}
                    className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                  >
                    <span>{page.h1}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* FAQ */}
        {config.faqTitle && config.faqs && config.faqs.length > 0 && (
          <section className="mb-10" aria-labelledby="faq-section">
            <Card className="p-5 md:p-6 bg-white/90 dark:bg-gray-900/80">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                <h2 id="faq-section" className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  {config.faqTitle}
                </h2>
              </div>
              <div className="space-y-4">
                {config.faqs.map((faq, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {faq.question}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}

