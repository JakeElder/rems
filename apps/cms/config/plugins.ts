export default ({ env }) => ({
  "google-map-picker": {
    config: {
      apiKey: env("GOOGLE_PUBLIC_KEY"),
      default_center: { lat: 13.6563, lng: 100.5018 }
    }
  }
});
