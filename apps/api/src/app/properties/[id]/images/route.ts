import { ImageSchema } from "@rems/schemas";
import * as Models from "@/models";
import { NextResponse } from "next/server";
import { Image } from "@rems/types";

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

  const processImage = (i: any): Image => {
    if (i.provider === "local") {
      return {
        type: "local",
        props: { ...i, url: `${process.env.ASSET_URL}${i.url}` }
      };
    }

    return {
      type: "cloudinary",
      props: { ...i, id: i.providerMetadata.public_id }
    };
  };

  let images = raw.map(processImage);

  if (images.length === 0) {
    images = [
      ImageSchema.parse({
        type: "local",
        props: {
          id: 1,
          width: 800,
          height: 450,
          url: "/default.png"
        }
      })
    ];
  }

  return NextResponse.json(images);
}
