import {
  BudgetAndAvailabilityRequirementsSchema,
  IndoorFeatureRequirementsSchema,
  LocationSourceSchema,
  LotFeatureRequirementsSchema,
  OutdoorFeatureRequirementsSchema,
  PropertyTypeRequirementsSchema,
  RealEstateIndexPageAndSortSchema,
  SpaceRequirementsSchema,
  ViewTypeRequirementsSchema
} from "@rems/schemas/user-mutable-state";
import { DeepPartial, Group } from "../types";
import { RealEstateQuerySchema } from "@rems/schemas";
import store from "../store";
import { realEstateQuery } from "../defaults";
import { RealEstateQuery } from "@rems/types";

type BudgetAndAvailability = Group<
  "budgetAndAvailability",
  typeof BudgetAndAvailabilityRequirementsSchema
>;

type Location = Group<"locationSource", typeof LocationSourceSchema>;

type PageAndSort = Group<
  "pageAndSort",
  typeof RealEstateIndexPageAndSortSchema
>;

type Space = Group<"space", typeof SpaceRequirementsSchema>;

type IndoorFeatures = Group<
  "indoorFeatures",
  typeof IndoorFeatureRequirementsSchema
>;
type LotFeatures = Group<"lotFeatures", typeof LotFeatureRequirementsSchema>;
type OutdoorFeatures = Group<
  "outdoorFeatures",
  typeof OutdoorFeatureRequirementsSchema
>;
type ViewTypes = Group<"viewTypes", typeof ViewTypeRequirementsSchema>;
type PropertyTypes = Group<
  "propertyTypes",
  typeof PropertyTypeRequirementsSchema
>;

type Modules =
  | BudgetAndAvailability
  | Location
  | PageAndSort
  | Space
  | IndoorFeatures
  | LotFeatures
  | OutdoorFeatures
  | PropertyTypes
  | ViewTypes;

const realEstateQueryStore = (initial: DeepPartial<RealEstateQuery>) => {
  return store<typeof RealEstateQuerySchema, Modules>({
    defaults: realEstateQuery,
    schema: RealEstateQuerySchema,
    initial,
    groups: [
      {
        id: "budgetAndAvailability",
        type: "SCALAR",
        schema: BudgetAndAvailabilityRequirementsSchema
      },
      {
        id: "locationSource",
        type: "SCALAR",
        schema: LocationSourceSchema
      },
      {
        id: "pageAndSort",
        type: "SCALAR",
        schema: RealEstateIndexPageAndSortSchema
      },
      {
        id: "space",
        type: "SCALAR",
        schema: SpaceRequirementsSchema
      },
      {
        id: "indoorFeatures",
        type: "ARRAY",
        schema: IndoorFeatureRequirementsSchema
      },
      {
        id: "lotFeatures",
        type: "ARRAY",
        schema: LotFeatureRequirementsSchema
      },
      {
        id: "outdoorFeatures",
        type: "ARRAY",
        schema: OutdoorFeatureRequirementsSchema
      },
      {
        id: "propertyTypes",
        type: "ARRAY",
        schema: PropertyTypeRequirementsSchema
      },
      {
        id: "viewTypes",
        type: "ARRAY",
        schema: PropertyTypeRequirementsSchema
      }
    ]
  });
};

export default realEstateQueryStore;
