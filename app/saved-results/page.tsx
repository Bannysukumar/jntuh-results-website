"use client";

import SavedResults from "@/components/native/saved-results";
import Title from "@/components/homepage/title";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SavedResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Title />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Saved Results
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your saved results. Results are saved locally on your device.
          </p>
        </div>
        <SavedResults />
      </div>
    </div>
  );
}

