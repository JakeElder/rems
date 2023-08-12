import { NextResponse } from "next/server";
import { preprocessNl } from "../../../remi/preprocess-nl";

export async function POST(req: Request) {
  const data = await req.json();
  const res = await preprocessNl(data.nl);
  return NextResponse.json(res);
}
