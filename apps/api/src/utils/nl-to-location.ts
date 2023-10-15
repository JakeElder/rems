import { google } from "googleapis";

export const nlToLocation = async (
  location: string
): Promise<{
  lat: number;
  lng: number;
  placeId: string;
}> => {
  const places = google.places({
    version: "v1",
    auth: process.env.PLACES_API_KEY
  });

  const r = await places.places.searchText({
    requestBody: { textQuery: location },
    fields: ["displayName", "editorialSummary", "location", "viewport", "id"]
      .map((l) => `places.${l}`)
      .join(",")
  });

  const place = r.data.places?.[0];
  const lat = place?.location?.latitude;
  const lng = place?.location?.longitude;
  const placeId = place?.id;

  if (!lat || !lng || !placeId) {
    throw new Error(`Couldn't resolve location: ${location}`);
  }

  console.log(location, place);

  return { lat, lng, placeId };
};
