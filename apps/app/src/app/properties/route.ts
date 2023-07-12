import { NextResponse } from "next/server";
import api from "../../api";
import qs from "qs";
import { realEstateQuerySchema } from "@rems/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = qs.parse(url.search.substring(1));
  const query = realEstateQuerySchema.parse(params);
  const res = await api.get.properties(query);
  return NextResponse.json(res);
}
