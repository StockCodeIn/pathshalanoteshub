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
  // keep an empty turbopack config so Next won't fail when Turbopack is enabled
  // cast export to `any` below to avoid strict type errors for this key
  turbopack: {},
};

export default nextConfig as any;