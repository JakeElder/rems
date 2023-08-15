import arr from "./array";
import { FilterSchema } from "@rems/schemas";
import { Filter } from "@rems/types";
import { Model as ModelType, ModelStatic } from "sequelize";
type Model = ModelStatic<ModelType>;
import * as Models from "@/models";

const filter = async (Entity: Model, nl: string, current: Filter["slug"][]) => {
  const raw = await Entity.findAll({ raw: true });
  const filters = raw.map((r) => FilterSchema.parse(r));
  return arr({ type: Entity.name, current, filters, nl });
};

export const indoorFeatures = (nl: string, current: Filter["slug"][]) =>
  filter(Models.IndoorFeature, nl, current);
