/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  transpilePackages: ["@rems/ui"],
  images: {
    remotePatterns: [{ hostname: "127.0.0.1" }]
  }
};

module.exports = nextConfig;
