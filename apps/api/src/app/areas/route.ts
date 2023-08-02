import { FilterSchema } from "@rems/schemas";
import * as Models from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  const raw = await Models.Area.findAll({ raw: true });
  return NextResponse.json(raw.map((r: any) => FilterSchema.parse(r)));
}
