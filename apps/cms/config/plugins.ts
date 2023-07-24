export default ({ env }) => {
  const mapPicker = {
    "google-map-picker": {
      config: {
        apiKey: env("GOOGLE_PUBLIC_KEY"),
        defaultCenter: { lat: 13.6563, lng: 100.5018 }
      }
    }
  };

  const cloudinary = {
    upload: {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: env("CLOUDINARY_NAME"),
          api_key: env("CLOUDINARY_KEY"),
          api_secret: env("CLOUDINARY_SECRET")
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {}
        }
      }
    }
  };

  if (env("NODE_ENV", "development") === "development") {
    return {
      ...mapPicker
    };
  }

  return {
    ...mapPicker,
    ...cloudinary
  };
};
