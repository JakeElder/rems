import { NextResponse } from "next/server";
import { RealEstateQuerySchema } from "@rems/schemas";
import qs from "query-string";
import { nlToFn } from "../../remi";

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
  const fn = await nlToFn(data.query, data.nl);

  if (!fn) {
    return NextResponse.json({});
  }

  if (fn.name === "updateQuery") {
    const remove = JSON.parse(fn.arguments || "{}").remove || {};
    const add = JSON.parse(fn.arguments || "{}").add || {};

    console.log(add);

    const removed = Object.keys(remove).reduce((query, key) => {
      if (Array.isArray(query[key])) {
        return {
          ...query,
          [key]: query[key].filter((v: any) => !remove[key].includes(v))
        };
      }
      const { [key]: _, ...rest } = query;
      return rest;
    }, data.query);

    const added = Object.keys(add).reduce((query, key) => {
      if (Array.isArray(query[key])) {
        return {
          ...query,
          [key]: [...query[key], ...add[key]]
        };
      }
      return { ...query, [key]: add[key] };
    }, removed);

    if (added["search-origin"]) {
      const location = await nlToLocation(added["search-origin"]);
      if (location) {
        added["search-origin-id"] = location.placeId;
        added["search-origin-lat"] = location.lat;
        added["search-origin-lng"] = location.lng;
      }
    }

    return NextResponse.json(added);
  }
}
