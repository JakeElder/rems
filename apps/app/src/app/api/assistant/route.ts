import { NextResponse } from "next/server";
import nlToLocation from "../../../utils/nl-to-location";
import { nlToQuery } from "../../../lib/Remi";
import { PartialRealEstateQuery } from "@rems/types";

export async function POST(req: Request) {
  const data = await req.json();
  const aiQuery = await nlToQuery(data.query, data.nl);

  if (!aiQuery) {
    return NextResponse.error();
  }

  const { "search-origin": searchOrigin, ...rest } = aiQuery;
  const query: PartialRealEstateQuery = rest;

  if (searchOrigin) {
    const location = await nlToLocation(searchOrigin);
    if (location) {
      query["search-origin-id"] = location.placeId;
      query["search-origin-lat"] = location.lat;
      query["search-origin-lng"] = location.lng;
    }
  }

  return NextResponse.json(query);
}
