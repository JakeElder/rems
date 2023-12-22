import { FilterSchema, PropertySchema } from "@rems/schemas";
import * as Models from "@/models";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { Property } from "@rems/types";

type Params = {
  params: { id: string };
};

const parse = (rows: any) => rows.map((r: any) => FilterSchema.parse(r));

const getFilters = async (id: Property["id"]) => {
  const [
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  ] = await Promise.all([
    Models.IndoorFeature.findAll({
      raw: true,
      include: [
        {
          model: Models.PropertiesIndoorFeaturesLink,
          where: { property_id: id },
          attributes: []
        }
      ]
    }).then(parse),
    Models.LotFeature.findAll({
      include: [
        {
          model: Models.PropertiesLotFeaturesLink,
          where: { property_id: id },
          attributes: []
        }
      ],
      raw: true
    }).then(parse),
    Models.OutdoorFeature.findAll({
      include: [
        {
          model: Models.PropertiesOutdoorFeaturesLink,
          where: { property_id: id },
          attributes: []
        }
      ],
      raw: true
    }).then(parse),
    Models.ViewType.findAll({
      raw: true,
      include: [
        {
          model: Models.PropertiesViewTypesLink,
          where: { property_id: id },
          attributes: []
        }
      ]
    }).then(parse),
    Models.PropertyType.findAll({
      raw: true,
      include: [
        {
          model: Models.PropertiesPropertyTypeLink,
          where: { property_id: id },
          attributes: []
        }
      ]
    }).then(parse)
  ]);

  return {
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  };
};

export async function GET(_req: Request, { params }: Params) {
  const res = await Promise.all([
    Models.Property.findOne({
      where: { id: params.id },
      raw: true
    }),
    getFilters(parseInt(params.id, 10))
  ]);

  if (!res[0]) {
    return new Response(null, { status: 404 });
  }

  const raw: any = res[0];

  const format = (val: number | null) =>
    val ? `฿${val.toLocaleString()}` : null;

  const slug = slugify(raw.title, { strict: true });
  const property = PropertySchema.parse({
    ...res[0],
    url: `/real-estate/${slug}-${raw.id}`,
    formattedPurchasePrice: format(raw.purchasePrice),
    formattedRentalPrice: format(raw.rentalPrice),
    ...res[1]
  });

  return NextResponse.json(property);
}
