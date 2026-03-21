import Link from "next/link";

type ToolPageEditorialProps = {
  heading: string;
  paragraphs: string[];
  /** Optional short legal / disclaimer line */
  note?: string;
};

/**
 * Reusable editorial block for tool pages — helps meet AdSense minimum content
 * and gives users context beyond the form alone.
 */
export default function ToolPageEditorial({
  heading,
  paragraphs,
  note,
}: ToolPageEditorialProps) {
  return (
    <section className="max-w-2xl mx-auto px-4 pb-12 mt-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          {heading}
        </h2>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          {paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        {note ? (
          <p className="text-xs italic text-center text-gray-500 dark:text-gray-400 mt-6">
            {note}
          </p>
        ) : null}
        <nav
          className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-blue-600 dark:text-blue-400"
          aria-label="Related pages"
        >
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <span className="text-gray-300 dark:text-gray-600" aria-hidden>
            ·
          </span>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <span className="text-gray-300 dark:text-gray-600" aria-hidden>
            ·
          </span>
          <Link href="/disclaimer" className="hover:underline">
            Disclaimer
          </Link>
          <span className="text-gray-300 dark:text-gray-600" aria-hidden>
            ·
          </span>
          <Link href="/faq" className="hover:underline">
            FAQ
          </Link>
        </nav>
      </div>
    </section>
  );
}
