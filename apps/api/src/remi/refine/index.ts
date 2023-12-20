import { FilterSchema } from "@rems/schemas";
import factory from "./filter-array";
import { Model, ModelStatic } from "sequelize";
import * as Models from "@/models";

const filterArray = (Model: ModelStatic<Model>) =>
  factory(
    `${Model.name}s`,
    (async () => {
      const raw = await Model.findAll({ raw: true });
      return raw.map((r) => FilterSchema.parse(r));
    })()
  );

export type FilterArrayFn = ReturnType<typeof filterArray>;

export const indoorFeatures = filterArray(Models.IndoorFeature);
export const outdoorFeatures = filterArray(Models.OutdoorFeature);
export const propertyTypes = filterArray(Models.PropertyType);
export const lotFeatures = filterArray(Models.LotFeature);
export const viewTypes = filterArray(Models.ViewType);

export { default as location } from "./location";
export { default as page } from "./page";
export { default as sort } from "./sort";
export { default as spaceRequirements } from "./space-requirements";
export { default as budgetAndAvailability } from "./budget-and-availability";
