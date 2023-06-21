export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const outdoorFeatures = [
      { name: "Pool" },
      { name: "Terrace" },
      { name: "Garden" },
      { name: "Balcony" },
      { name: "Garage" },
      { name: "Outdoor Kitchen" },
      { name: "Boat House" },
      { name: "Tennis Court" },
      { name: "Vineyard / Winery" },
      { name: "Helipad" },
      { name: "Private Beach" },
      { name: "Private Airport" }
    ];

    //     await strapi.db.query("api::outdoor-feature.outdoor-feature").createMany({
    //       data: outdoorFeatures
    //     });

    // await strapi.db
    //   .connection("outdoor_features")
    //   .update("published_at", new Date().toISOString())
    //   .whereNull("published_at");

    const indoorFeatures = [
      { name: "Air Conditioning" },
      { name: "Open Kitchen" },
      { name: "Bar" },
      { name: "Fitness Center / Gym" },
      { name: "Fireplace" },
      { name: "Cinema" },
      { name: "Game Room" },
      { name: "Jacuzzi" },
      { name: "Wine Cellar" },
      { name: "Sauna" },
      { name: "Office" },
      { name: "Elevator" },
      { name: "Steam Room" },
      { name: "Indoor Pool" },
      { name: "Library" }
    ];

    // await strapi.db.query("api::indoor-feature.indoor-feature").createMany({
    //   data: indoorFeatures
    // });

    const lotFeatures = [
      { name: "Privacy" },
      { name: "Modern" },
      { name: "Gated Community" },
      { name: "New Built" },
      { name: "Investment Property" },
      { name: "Coastal" },
      { name: "Mansion" },
      { name: "Hilltop" },
      { name: "High Altitude" },
      { name: "City View" },
      { name: "Renovated" },
      { name: "Beachfront" },
      { name: "Oceanfront" },
      { name: "Seafront" },
      { name: "Waterfront" },
      { name: "Duplex" },
      { name: "Equestrian" },
      { name: "Lakefront" },
      { name: "Riverfront" },
      { name: "Ski-In / Ski-Out" }
    ];

    // await strapi.db.query("api::indoor-feature.indoor-feature").createMany({
    //   data: indoorFeatures
    // });
  }
};
