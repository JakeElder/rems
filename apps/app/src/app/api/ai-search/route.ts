import { NextResponse } from "next/server";
import qs from "qs";
import nlToQuery from "../../../utils/nl-to-query";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = qs.parse(url.search.substring(1));
  const res = await nlToQuery(params.query as string);
  return NextResponse.json(res);
}
