import {
  Client,
  PlacesNearbyRequest
} from "@googlemaps/google-maps-services-js";

const client = new Client();

const KEY = process.env.PLACES_API_KEY;

if (!KEY) {
  throw new Error();
}

const getNearbyPlaces = async (
  location: PlacesNearbyRequest["params"]["location"],
  keyword: PlacesNearbyRequest["params"]["keyword"]
) => {
  const res = await client.placesNearby({
    params: {
      location,
      keyword,
      radius: 10000,
      key: KEY
    }
  });

  if (res.data.results.length) {
    return res.data.results.slice(0, 3);
  }

  return [];
};

export default getNearbyPlaces;
