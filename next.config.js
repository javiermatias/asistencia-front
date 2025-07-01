/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  },
    experimental: {
        // …
        serverComponentsExternalPackages: ['@react-pdf/renderer']
      }
};

module.exports = nextConfig;
