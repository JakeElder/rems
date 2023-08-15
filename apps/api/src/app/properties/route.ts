import { NextResponse } from "next/server";
import qs from "qs";
import { RealEstateQuerySchema } from "@rems/schemas";
import resolve from "./resolve";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = qs.parse(url.search.substring(1));
  const query = RealEstateQuerySchema.Server.parse(params);
  const properties = await resolve(query);
  return NextResponse.json(properties);
}
