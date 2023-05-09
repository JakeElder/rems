/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  transpilePackages: ["@rems/ui"],
  images: {
    remotePatterns: [
      { hostname: "127.0.0.1" },
      { hostname: "cms.stage.jyoproperty.com" }
    ]
  }
};

module.exports = nextConfig;
