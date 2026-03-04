/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Keep normal server mode for web/Vercel (API routes enabled),
   * and only use static export for explicit native/export builds.
   */
  ...(process.env.NEXT_EXPORT === "true" && {
    output: "export",
  }),
  images: {
    unoptimized: process.env.NEXT_EXPORT === "true",
  },
};

module.exports = nextConfig;


