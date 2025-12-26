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

  // Experimental options to prevent build trace stack overflow
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core*/**/*',
        'node_modules/next/dist/compiled/@swc/**/*',
        'node_modules/next/dist/compiled/webpack/**/*',
        'scripts/**/*',
      ],
    },
  },
};

module.exports = nextConfig;
