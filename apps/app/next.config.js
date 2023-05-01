/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  transpilePackages: ["@rems/ui"],
  images: {
    remotePatterns: [
      { hostname: "127.0.0.1" },
      { hostname: "https://cms.stage.jyo.mindfulstudio.io/" }
    ]
  }
};

module.exports = nextConfig;
