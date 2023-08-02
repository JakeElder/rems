import { NextResponse } from "next/server";
import qs from "qs";
import { ServerRealEstateQuerySchema } from "@rems/schemas";
import resolve from "./resolve";

export const runtime = "edge";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = qs.parse(url.search.substring(1));
  const query = ServerRealEstateQuerySchema.parse(params);
  return NextResponse.json(await resolve(query));
}
