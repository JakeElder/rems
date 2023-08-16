import arr from "./array";
import { FilterSchema } from "@rems/schemas";
import { Filter } from "@rems/types";
import { Model, ModelStatic } from "sequelize";
import * as Models from "@/models";
import { ReviseArrayFn } from "../types";

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

export const indoorFeatures: ReviseArrayFn = (nl, current) =>
  filter("Indoor Features", filters(Models.IndoorFeature), nl, current);

export const outdoorFeatures = (nl: string, current: Slug[]) =>
  filter("Outdoor Features", filters(Models.OutdoorFeature), nl, current);

export const lotFeatures = (nl: string, current: Slug[]) =>
  filter("Lot Features", filters(Models.LotFeature), nl, current);

export const propertyTypes = (nl: string, current: Slug[]) =>
  filter("Property Types", filters(Models.PropertyType), nl, current);

export const viewTypes = (nl: string, current: Slug[]) =>
  filter("View Types", filters(Models.ViewType), nl, current);

export { arr };
