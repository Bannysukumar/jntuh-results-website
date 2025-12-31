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
    unoptimized: true, // Required for static export
  },
  
  // Static export for standalone native app
  // This ensures the app is fully self-contained and not a web wrapper
  // Native app uses external API endpoints, not local Next.js API routes
  output: 'export',
  
  // Disable features that require server-side rendering
  trailingSlash: true,
};

module.exports = nextConfig;
