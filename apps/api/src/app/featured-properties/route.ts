import * as Models from "@/models";
import { PropertySchema } from "@rems/schemas";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { Op } from "sequelize";
import { Image } from "@rems/types";

export async function GET() {
  const raw = await Models.FeaturedPropertyListsPropertiesLink.findAll({
    attributes: [],
    include: [
      {
        model: Models.Property,
        where: { location: { [Op.ne]: null } },
        include: [{ model: Models.File, as: "images" }]
      }
    ],
    order: [["propertyOrder", "ASC"]]
  });

  if (raw.length === 0) {
    return new Response(JSON.stringify({ error: "No featured properties" }), {
      status: 500
    });
  }

  const format = (val: number | null) =>
    val ? `฿${val.toLocaleString()}` : null;

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

  const properties = raw.map((l: any) => {
    const p = l.Property.toJSON();
    const slug = slugify(p.title, { strict: true });
    return PropertySchema.parse({
      ...p,
      url: `/real-estate/${slug}-${p.id}`,
      formattedPurchasePrice: format(p.purchasePrice),
      formattedRentalPrice: format(p.rentalPrice),
      images: p.images.map(processImage)
    });
  });

  return NextResponse.json(properties);
}
