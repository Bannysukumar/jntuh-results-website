"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { isNative } from "@/lib/native-features";

/**
 * Conditionally renders SpeedInsights only for web deployments
 * Native apps don't need Vercel Speed Insights
 */
export default function SpeedInsightsWrapper() {
  // Only load SpeedInsights for web, not native apps
  if (isNative()) {
    return null;
  }

  return <SpeedInsights />;
}

