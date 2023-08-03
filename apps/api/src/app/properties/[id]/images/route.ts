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

  let images = raw.map((i: any) =>
    ImageSchema.parse({
      ...i,
      url: `${process.env.ASSET_URL}${i.url}`
    })
  );

  if (images.length === 0) {
    images = [
      ImageSchema.parse({
        id: 1,
        width: 800,
        height: 450,
        url: "https://res.cloudinary.com/dxnqopswh/image/upload/v1691021749/default_nopiyd.png"
      })
    ];
  }

  return NextResponse.json(images);
}
