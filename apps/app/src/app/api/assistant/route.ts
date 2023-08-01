import { NextResponse } from "next/server";
import nlToLocation from "../../../utils/nl-to-location";
import { nlToQuery } from "../../../lib/Remi";
import { RealEstateQuerySchema } from "@rems/schemas";

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
