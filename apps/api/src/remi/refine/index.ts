import arr from "./array";
import { FilterSchema } from "@rems/schemas";
import { Filter } from "@rems/types";
import { Model, ModelStatic } from "sequelize";
import * as Models from "@/models";
import { RefineArrayFn } from "../types";

type FilterFn = (
  type: string,
  filters: Promise<Filter[]>,
  nl: string,
  current: Filter["slug"][]
) => ReturnType<typeof arr>;

const filter: FilterFn = async (type, filters, nl, current) =>
  arr({ type, current, filters: await filters, nl });

const filters = (Model: ModelStatic<Model>) =>
  Model.findAll({ raw: true }).then((res) =>
    res.map((r: any) => FilterSchema.parse(r))
  );

type Slug = Filter["slug"];

export const indoorFeatures: RefineArrayFn = (nl, current) =>
  filter("Indoor Features", filters(Models.IndoorFeature), nl, current);

export const outdoorFeatures: RefineArrayFn = (nl, current) =>
  filter("Outdoor Features", filters(Models.OutdoorFeature), nl, current);

export const lotFeatures: RefineArrayFn = (nl, current) =>
  filter("Lot Features", filters(Models.LotFeature), nl, current);

export const propertyTypes: RefineArrayFn = (nl, current) =>
  filter("Property Types", filters(Models.PropertyType), nl, current);

export const viewTypes: RefineArrayFn = (nl, current) =>
  filter("View Types", filters(Models.ViewType), nl, current);

export { arr };

export { default as location } from "./location";
export { default as mapState } from "./map-state";
export { default as pageAndSort } from "./page-and-sort";
export { default as spaceRequirements } from "./space-requirements";
