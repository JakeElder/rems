import { FilterSchema } from "@rems/schemas";
import * as Models from "@/models";
import { NextResponse } from "next/server";

type Params = {
  params: { id: string };
};

export async function GET(_: Request, { params }: Params) {
  const raw = await Models.ViewType.findAll({
    include: [
      {
        model: Models.PropertiesViewTypesLink,
        where: { property_id: params.id },
        attributes: []
      }
    ],
    raw: true
  });

  const features = raw.map((i: any) => FilterSchema.parse(i));
  return NextResponse.json(features);
}
