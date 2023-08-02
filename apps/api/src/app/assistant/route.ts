import { NextResponse } from "next/server";
import { RealEstateQuerySchema } from "@rems/schemas";
import qs from "query-string";
import { nlToQuery } from "../../remi";

const PLACES_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";

const nlToLocation = async (
  nl: string
): Promise<{ lat: number; lng: number; placeId: string } | null> => {
  const q = qs.stringify({
    query: nl,
    key: process.env.PLACES_API_KEY
    // location: BIAS
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
};

export async function POST(req: Request) {
  const data = await req.json();
  const aiQuery: any = await nlToQuery(data.query, data.nl);

  if (!aiQuery) {
    return NextResponse.error();
  }

  const query = RealEstateQuerySchema.parse(aiQuery);

  if (aiQuery["search-origin"]) {
    const location = await nlToLocation(aiQuery["search-origin"]);
    if (location) {
      query["search-origin-id"] = location.placeId;
      query["search-origin-lat"] = location.lat;
      query["search-origin-lng"] = location.lng;
    }
  }

  return NextResponse.json(query);
}
