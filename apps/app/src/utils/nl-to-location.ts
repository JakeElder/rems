import qs from "query-string";

const PLACES_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const GOOGLE_API_KEY = "AIzaSyAnbY57UVXAVg2i4npH-DKiR5G0c5JP_UA";
const BIAS = "18.796143,98.979263"; // Chiang Mai

export default async function nlToLocation(
  nl: string
): Promise<{ lat: number; lng: number; placeId: string } | null> {
  const q = qs.stringify({
    query: nl,
    key: GOOGLE_API_KEY,
    location: BIAS
  });

  try {
    const res = await fetch(`${PLACES_URL}?${q}`);
    const { results } = await res.json();
    const { lat, lng } = results[0].geometry.location;
    return { lat, lng, placeId: results[0].place_id };
  } catch (e) {
    console.error(e);
    return null;
  }
}
