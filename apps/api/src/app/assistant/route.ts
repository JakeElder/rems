import { NextResponse } from "next/server";
import { ServerRealEstateQuerySchema } from "@rems/schemas";
import qs from "query-string";
import { preprocessNl } from "../../remi/preprocess-nl";
import { reviseQuery } from "../../remi/revise-query";
import * as jsonpatch from "fast-json-patch";

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
  const d = await preprocessNl(data.nl);

  const args = JSON.parse(d.arguments || "");
  if (d.name === "err") {
    return NextResponse.json({ error: true, message: args.m });
  }

  if (args.t === "RQ" || args.t === "NQ") {
    const query =
      args.t === "RQ" ? data.query : ServerRealEstateQuerySchema.parse({});
    const r = await reviseQuery(query, data.nl);
    console.log(JSON.parse(r.arguments || "[]"));
    console.log(jsonpatch.applyPatch(query, JSON.parse(r.arguments || "[]")));
    return NextResponse.json(r);
  }

  return NextResponse.json({});
}
