// filepath: d:\nextJs\education-notes\next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  generateEtags: false,
};

export default nextConfig;