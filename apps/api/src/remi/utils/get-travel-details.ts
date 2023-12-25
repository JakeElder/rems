import {
  Client,
  DirectionsRequest,
  TravelMode
} from "@googlemaps/google-maps-services-js";

const client = new Client();

const KEY = process.env.PLACES_API_KEY;

if (!KEY) {
  throw new Error();
}

type T = TravelMode;

const getTravelDetails = async (
  origin: DirectionsRequest["params"]["origin"],
  destination: DirectionsRequest["params"]["destination"]
) => {
  const res = await client.directions({
    params: {
      origin,
      destination,
      mode: TravelMode.transit,
      key: KEY
    }
  });

  return res.data;
};

export default getTravelDetails;
