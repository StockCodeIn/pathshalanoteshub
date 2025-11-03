// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
};

module.exports = nextConfig;

