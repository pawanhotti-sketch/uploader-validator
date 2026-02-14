/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wiffy.ai",
      },
      {
        protocol: "https",
        hostname: "static.wify.co.in",
      },
    ],
  },
};

module.exports = nextConfig;
