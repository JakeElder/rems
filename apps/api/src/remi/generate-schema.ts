import { FilterSchema, PartialAiRealEstateQuerySchema } from "@rems/schemas";
import { Filter, PartialRealEstateQuery } from "@rems/types";
import * as Models from "@/models";
import { zodToJsonSchema } from "zod-to-json-schema";

const enumArray = (key: keyof PartialRealEstateQuery, filters: Filter[]) => ({
  [key]: {
    type: "array",
    items: {
      type: "string",
      enum: filters.map((i) => i.slug)
    },
    default: []
  }
});

const parse = (rows: any) => rows.map((r: any) => FilterSchema.parse(r));

const enumProperties = async () => {
  const [
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  ] = await Promise.all([
    Models.IndoorFeature.findAll({ raw: true }).then(parse),
    Models.LotFeature.findAll({ raw: true }).then(parse),
    Models.OutdoorFeature.findAll({ raw: true }).then(parse),
    Models.ViewType.findAll({ raw: true }).then(parse),
    Models.PropertyType.findAll({ raw: true }).then(parse)
  ]);

  return {
    ...enumArray("indoor-features", indoorFeatures),
    ...enumArray("lot-features", lotFeatures),
    ...enumArray("outdoor-features", outdoorFeatures),
    ...enumArray("property-type", propertyTypes),
    ...enumArray("view-types", viewTypes)
  };
};

export const getQueryProperties = async () => {
  const schema = zodToJsonSchema(PartialAiRealEstateQuerySchema);
  return {
    ...(schema as any).properties,
    ...(await enumProperties())
  };
};

export const generateSchema = async () => {
  const schema = zodToJsonSchema(PartialAiRealEstateQuerySchema);
  return {
    ...schema,
    properties: await getQueryProperties()
  };
};
