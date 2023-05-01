export default [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        upgradeInsecureRequests: null,
        directives: {
          "connect-src": ["'self'", "https:"],
          "script-src": ["'self'", "maps.googleapis.com", "maps.gstatic.com"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "maps.googleapis.com",
            "maps.gstatic.com",
            "res.cloudinary.com"
          ],

          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "maps.googleapis.com",
            "maps.gstatic.com",
            "res.cloudinary.com"
          ]
        }
      }
    }
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public"
];
