async function seed(collection: string, data: any[]) {
  await strapi.db.query(`api::${collection}`).createMany({ data });
}

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
  async bootstrap({}) {
    if (process.env.SEED) {
      console.log("seeding");

      seed("indoor-feature.indoor-feature", [
        { name: "Air Conditioning", slug: "air-conditioning" },
        { name: "Open Kitchen", slug: "open-kitchen" },
        { name: "Bar", slug: "bar" },
        { name: "Fitness Center / Gym", slug: "fitness-center-gym" },
        { name: "Fireplace", slug: "fireplace" },
        { name: "Cinema", slug: "cinema" },
        { name: "Game Room", slug: "game-room" },
        { name: "Jacuzzi", slug: "jacuzzi" },
        { name: "Wine Cellar", slug: "wine-cellar" },
        { name: "Sauna", slug: "sauna" },
        { name: "Office", slug: "office" },
        { name: "Elevator", slug: "elevator" },
        { name: "Steam Room", slug: "steam-room" },
        { name: "Indoor Pool", slug: "indoor-pool" },
        { name: "Library", slug: "library" },
        { name: "Pet Friendly", slug: "pet-friendly" }
      ]);

      seed("lot-feature.lot-feature", [
        { name: "Privacy", slug: "privacy" },
        { name: "Modern", slug: "modern" },
        { name: "Gated Community", slug: "gated-community" },
        { name: "New Built", slug: "new-built" },
        { name: "Investment Property", slug: "investment-property" },
        { name: "Coastal", slug: "coastal" },
        { name: "Mansion", slug: "mansion" },
        { name: "Hilltop", slug: "hilltop" },
        { name: "High Altitude", slug: "high-altitude" },
        { name: "City View", slug: "city-view" },
        { name: "Renovated", slug: "renovated" },
        { name: "Beachfront", slug: "beachfront" },
        { name: "Oceanfront", slug: "oceanfront" },
        { name: "Seafront", slug: "seafront" },
        { name: "Waterfront", slug: "waterfront" },
        { name: "Duplex", slug: "duplex" },
        { name: "Equestrian", slug: "equestrian" },
        { name: "Lakefront", slug: "lakefront" },
        { name: "Riverfront", slug: "riverfront" },
        { name: "Ski-In / Ski-Out", slug: "ski-in-ski-out" },
        { name: "Meeting Room", slug: "meeting-room" },
        { name: "Co-Working Space", slug: "coworking-space" }
      ]);

      seed("outdoor-feature.outdoor-feature", [
        { name: "Pool", slug: "pool" },
        { name: "Terrace", slug: "terrace" },
        { name: "Garden", slug: "garden" },
        { name: "Balcony", slug: "balcony" },
        { name: "Garage", slug: "garage" },
        { name: "Outdoor Kitchen", slug: "outdoor-kitchen" },
        { name: "Boat House", slug: "boat-house" },
        { name: "Tennis Court", slug: "tennis-court" },
        { name: "Vineyard / Winery", slug: "vineyard-winery" },
        { name: "Helipad", slug: "helipad" },
        { name: "Private Beach", slug: "private-beach" },
        { name: "Private Airport", slug: "private-airport" }
      ]);

      seed("property-type.property-type", [
        { name: "House", slug: "house" },
        { name: "Villa", slug: "villa" },
        { name: "Estate", slug: "estate" },
        { name: "Country House", slug: "country-house" },
        { name: "Chalet", slug: "chalet" },
        { name: "Townhouse", slug: "townhouse" },
        { name: "Bungalow", slug: "bungalow" },
        { name: "Apartment", slug: "apartment" },
        { name: "Penthouse", slug: "penthouse" },
        { name: "Condo", slug: "condo" },
        { name: "Land", slug: "land" },
        { name: "Castle", slug: "castle" },
        { name: "Chateau", slug: "chateau" },
        { name: "Farm Ranch", slug: "farm-ranch" },
        { name: "Residence", slug: "residence" },
        { name: "Commercial", slug: "commercial" },
        { name: "Shop", slug: "shop" },
        { name: "Office", slug: "office" }
      ]);

      seed("view-type.view-type", [
        { name: "Panoramic / Scenic View", slug: "panoramic-scenic-view" },
        { name: "Mountain View", slug: "mountain-view" },
        { name: "Water View", slug: "water-view" },
        { name: "Ocean View", slug: "ocean-view" },
        { name: "Sea View", slug: "sea-view" },
        { name: "Lake View", slug: "lake-view" },
        { name: "River View", slug: "river-view" },
        { name: "Golf View", slug: "golf-view" },
        { name: "City View", slug: "city-view" },
        { name: "Unblocked View", slug: "unblocked-view" },
        { name: "North Facing", slug: "north-facing" },
        { name: "South Facing", slug: "south-facing" },
        { name: "East Facing", slug: "east-facing" },
        { name: "West Facing", slug: "west-facing" }
      ]);
    }
  }
};

// await strapi.db
//   .connection("outdoor_features")
//   .update("published_at", new Date().toISOString())
//   .whereNull("published_at");
