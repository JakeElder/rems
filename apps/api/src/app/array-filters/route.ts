import { NextResponse } from "next/server";
import resolve from "./resolve";

export async function GET() {
  return NextResponse.json(await resolve());
}
