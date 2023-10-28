import * as Models from "@/models";
import { FilterSchema } from "@rems/schemas";
import { ArrayFilters } from "@rems/types";

const parse = (rows: any) => rows.map((r: any) => FilterSchema.parse(r));

const resolve = async (): Promise<ArrayFilters> => {
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
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  };
};

export default resolve;
