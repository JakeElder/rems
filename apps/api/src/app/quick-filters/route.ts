import * as Models from "@/models";
import { FilterSchema } from "@rems/schemas";
import { NextResponse } from "next/server";
import { snakeCase } from "snake-case";

export const revalidate = 60;

export async function GET() {
  const raw = await Models.QuickFiltersComponent.findAll({
    raw: true,
    order: [["order", "ASC"]]
  });

  const modelMap: any = {
    "quick-filters.indoor-feature": [
      Models.ComponentsQuickFiltersIndoorFeaturesFilterLink,
      Models.IndoorFeature,
      "indoorFeatures"
    ],
    "quick-filters.outdoor-feature": [
      Models.ComponentsQuickFiltersOutdoorFeaturesFilterLink,
      Models.OutdoorFeature,
      "outdoorFeatures"
    ],
    "quick-filters.view-type": [
      Models.ComponentsQuickFiltersViewTypesFilterLink,
      Models.ViewType,
      "viewTypes"
    ],
    "quick-filters.lot-feature": [
      Models.ComponentsQuickFiltersLotFeaturesFilterLink,
      Models.LotFeature,
      "lotFeatures"
    ]
  };

  const filters = await Promise.all(
    raw.map(async (c: any) => {
      const entity = modelMap[c.componentType];
      if (entity) {
        const [Link, Model, key] = entity;
        const r: any = await Link.findOne({
          where: {
            [`${snakeCase(Model.name)}_id`]: c.componentId
          },
          attributes: [],
          include: [{ model: Model }]
        });
        return {
          key,
          filter: FilterSchema.parse(r[Model.name].toJSON())
        };
      }
    })
  );

  return NextResponse.json(filters);
}
