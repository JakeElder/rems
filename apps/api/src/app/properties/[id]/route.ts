import { NextResponse } from "next/server";
import resolve from "./resolve";

type Params = {
  params: { id: string };
};

export async function GET(_req: Request, { params }: Params) {
  const property = await resolve(parseInt(params.id, 10));

  if (!property) {
    return new Response(null, { status: 404 });
  }

  return NextResponse.json(property);
}
