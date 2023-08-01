import { ServerRealEstateQuerySchema } from "@rems/schemas";
import { NextResponse } from "next/server";
import qs from "query-string";
import queryToNlTitle from "../../../utils/query-to-nl-title";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = qs.parse(url.search.substring(1));
  const query = ServerRealEstateQuerySchema.parse(params);
  const title = await queryToNlTitle(query);
  console.log(title);
  return NextResponse.json(title);
}
