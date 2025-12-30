/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO Optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true, // Required if using static export for Android
  },
  
  // For native app with API routes, we keep dynamic rendering
  // The app loads from URL but has native features for enhanced UX
  // output: 'export', // Uncomment only if you move all APIs to external services
};

module.exports = nextConfig;
