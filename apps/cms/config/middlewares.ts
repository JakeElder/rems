export default [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "maps.googleapis.com", "maps.gstatic.com"],
          "img-src": [
            "'self'",
            "data:",
            "maps.googleapis.com",
            "maps.gstatic.com"
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
