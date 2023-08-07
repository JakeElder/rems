/** @type {import('next').NextConfig} */

const update = require("immutability-helper");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

const nextConfig = {
  experimental: {
    serverActions: true
  },
  transpilePackages: [
    "@rems/ui",
    "@rems/schema",
    "@rems/types",
    "@rems/ts-api"
  ],
  images: {
    remotePatterns: [
      { hostname: "127.0.0.1" },
      { hostname: "cms.stage.jyoproperty.com" },
      { hostname: "res.cloudinary.com" }
    ]
  },
  webpack: (config, { isServer }) => {
    const base = update(config, {
      externals: { $push: [{ sequelize: "commonjs sequelize" }] },
      optimization: {
        minimize: { $set: process.env.NEXT_PUBLIC_ENV === "production" }
      }
    });

    if (process.env.NEXT_PUBLIC_ENV === "production" && !isServer) {
      return update(config, {
        externals: {
          $push: [{ "mapbox-gl": "mapboxgl" }]
        }
      });
    }

    return base;
  }
};

module.exports = withBundleAnalyzer(nextConfig);
