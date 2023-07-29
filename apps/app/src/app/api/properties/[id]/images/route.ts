import { ImageSchema } from "@rems/schemas";
import * as Models from "@/models";
import { NextResponse } from "next/server";

type Params = {
  params: { id: string };
};

export async function GET(_req: Request, { params }: Params) {
  const raw = await Models.File.findAll({
    include: [
      {
        model: Models.FileRelatedMorph,
        where: { relatedId: params.id },
        attributes: []
      }
    ],
    raw: true
  });

  const images = raw.map((i: any) =>
    ImageSchema.parse({
      ...i,
      url: `${process.env.ASSET_URL}${i.url}`
    })
  );

  return NextResponse.json(images);
}
