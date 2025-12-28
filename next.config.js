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
  
  // Note: For Android app, we recommend using the live website URL approach
  // (configured in capacitor.config.ts) instead of static export.
  // This ensures all API routes and dynamic features work correctly.
  // If you want to use static export, uncomment the line below:
  // output: 'export',
};

module.exports = nextConfig;
