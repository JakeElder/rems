import * as Models from "@/models";
import { PropertySchema } from "@rems/schemas";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
  const raw = await Models.FeaturedPropertyListsPropertiesLink.findAll({
    attributes: [],
    include: [
      {
        model: Models.Property,
        include: [{ model: Models.File, as: "images" }]
      }
    ],
    order: [["propertyOrder", "ASC"]]
  });

  const format = (val: number | null) =>
    val ? `฿${val.toLocaleString()}` : null;

  const properties = raw.map((l: any) => {
    const p = l.Property.toJSON();
    const slug = slugify(p.title, { strict: true });
    return PropertySchema.parse({
      ...p,
      url: `/real-estate/${slug}-${p.id}`,
      formattedPurchasePrice: format(p.purchasePrice),
      formattedRentalPrice: format(p.rentalPrice),
      images: p.images.map((i: any) => ({
        ...i,
        url: `${process.env.ASSET_URL}${i.url}`
      }))
    });
  });

  return NextResponse.json(properties);
}
