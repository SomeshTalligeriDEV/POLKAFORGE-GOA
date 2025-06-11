// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    config.module.rules.push({
      test: /node_modules\/ws\/lib\/.*\.js/,
      resolve: {
        alias: {
          'bufferutil': false,
          'utf-8-validate': false,
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
