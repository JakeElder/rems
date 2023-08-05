import { AppConfigSchema } from "@rems/schemas";
import * as Models from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  const raw = await Models.AppConfig.findOne({ raw: true });
  return NextResponse.json(AppConfigSchema.parse(raw));
}
