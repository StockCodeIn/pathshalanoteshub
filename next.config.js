// next.config.js

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /pdf\.worker(\.min)?\.js$/,
      use: { loader: 'file-loader', options: { name: '[name].[hash].[ext]' } },
    });

    return config;
  },
};
