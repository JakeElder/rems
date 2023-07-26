/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

const nextConfig = {
  experimental: {
    serverActions: true
  },
  transpilePackages: ["@rems/ui", "@rems/types"],
  images: {
    remotePatterns: [
      { hostname: "127.0.0.1" },
      { hostname: "cms.stage.jyoproperty.com" },
      { hostname: "res.cloudinary.com" }
    ]
  },
  webpack: (config) => {
    return {
      ...config,
      externals: [...config.externals, { sequelize: "commonjs sequelize" }]
    };
  }
};

module.exports = withBundleAnalyzer(nextConfig);
