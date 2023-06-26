/** @type {import('next').NextConfig} */
// ffs
const nextConfig = {
  transpilePackages: ["@rems/ui"],
  images: {
    remotePatterns: [
      { hostname: "127.0.0.1" },
      { hostname: "cms.stage.jyoproperty.com" },
      { hostname: "res.cloudinary.com" }
    ]
  }
};

module.exports = nextConfig;
