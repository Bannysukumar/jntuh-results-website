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
    // Only unoptimize for static export (native builds)
    unoptimized: process.env.NEXT_EXPORT === 'true',
  },
  
  // Static export only for native app builds (when NEXT_EXPORT=true)
  // For Vercel/web deployment, use normal Next.js mode (supports API routes)
  // For native app builds, use static export (standalone, no API routes needed)
  ...(process.env.NEXT_EXPORT === 'true' && {
    output: 'export',
  }),
  
  // Disable features that require server-side rendering
  trailingSlash: true,
};

module.exports = nextConfig;
