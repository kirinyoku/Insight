/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // redirects to Kinde Auth API
    return [
      {
        source: "/sign-in",
        destination: "/api/auth/login",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/api/auth/register",
        permanent: true,
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};
const withNextIntl = require("next-intl/plugin")("./i18n.ts");

module.exports = withNextIntl(nextConfig);
