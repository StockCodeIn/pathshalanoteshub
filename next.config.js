// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Keep Turbopack config empty to avoid conflict with custom webpack
  turbopack: {},

  // ⚙️ Custom webpack rule for pdf.worker
  webpack: (config) => {
    config.module.rules.push({
      test: /pdf\.worker(\.min)?\.js$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
        },
      },
    });
    return config;
  },

  // 🚀 Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 🎯 Core Web Vitals optimization
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig;

