import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  reactStrictMode: true,

  compress: true,

  generateEtags: false,

  // Keep Turbopack config
  turbopack: {},

  // PDF worker support
  webpack: (config) => {
    config.module.rules.push({
      test: /pdf\.worker(\.min)?\.js$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[hash].[ext]",
        },
      },
    });

    return config;
  },

  images: {
    // Cloudinary already optimizes images
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],

    formats: ["image/avif", "image/webp"],

    deviceSizes: [
      640,
      750,
      828,
      1080,
      1200,
      1920,
      2048,
      3840,
    ],

    imageSizes: [
      16,
      32,
      48,
      64,
      96,
      128,
      256,
      384,
    ],
  },

  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;