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
  },

  // Use standalone output to reduce build trace complexity
  output: 'standalone',
};

module.exports = nextConfig;
