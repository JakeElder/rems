import { NextResponse } from "next/server";
import nlToQuery from "../../../utils/nl-to-query";

export async function POST(req: Request) {
  const data = await req.json();
  const res = await nlToQuery(data.query, data.nl);
  console.dir(res, { depth: null, colors: true });
  return NextResponse.json((res as any).nextQuery);
}
