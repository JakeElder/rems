import z from "zod";
import store, { Group } from "../src/store";
import { identifiable } from "../src/types";

type Location = Group<"LOCATION", typeof LocationSourceSchema>;
type BudgetAndAvailability = Group<
  "BUDGET_AND_AVAILABILITY",
  typeof BudgetAndAvailabilityRequirementsSchema
>;
type IndoorFeatures = Group<
  "INDOOR_FEATURES",
  typeof IndoorFeatureRequirementsSchema
>;

const LatLngLocationSourceSchema = z.object({
  type: z.literal("LL"),
  point: z.tuple([z.number(), z.number()]),
  radius: z.number().nullable()
});

const NlLocationSourceSchema = z.object({
  type: z.literal("NL"),
  description: z.string(),
  geospatialOperator: z.string(),
  radius: z.number().nullable()
});

const LocationSourceSchema = z
  .discriminatedUnion("type", [
    NlLocationSourceSchema,
    LatLngLocationSourceSchema
  ])
  .default({
    type: "NL",
    description: "Bangkok",
    geospatialOperator: "in",
    radius: null
  });

const SaleBudgetAndAvailabilityRequirementsSchema = z.object({
  type: z.literal("SALE"),
  minPrice: z.number(),
  maxPrice: z.number().max(10_000).nullable()
});

const RentBudgetAndAvailabilityRequirementsSchema = z.object({
  type: z.literal("RENT"),
  minPrice: z.number(),
  maxPrice: z.number().max(10_000).nullable()
});

const BudgetAndAvailabilityRequirementsSchema = z
  .discriminatedUnion("type", [
    SaleBudgetAndAvailabilityRequirementsSchema,
    RentBudgetAndAvailabilityRequirementsSchema
  ])
  .default({
    type: "SALE",
    minPrice: 0,
    maxPrice: null
  });

const IndoorFeatureRequirementsSchema = z
  .array(identifiable({ slug: z.string() }))
  .default([]);

const StateSchema = z.object({
  location: LocationSourceSchema,
  budgetAndAvailability: BudgetAndAvailabilityRequirementsSchema,
  indoorFeatures: IndoorFeatureRequirementsSchema
});

test("does stuff", () => {
  const { update } = store<
    typeof StateSchema,
    Location | BudgetAndAvailability | IndoorFeatures
  >({
    schema: StateSchema,
    groups: [
      {
        id: "LOCATION",
        k: "location",
        schema: LocationSourceSchema
      },
      {
        id: "BUDGET_AND_AVAILABILITY",
        k: "budgetAndAvailability",
        schema: BudgetAndAvailabilityRequirementsSchema
      },
      {
        id: "INDOOR_FEATURES",
        k: "indoorFeatures",
        schema: IndoorFeatureRequirementsSchema
      }
    ]
  });

  const one = update("BUDGET_AND_AVAILABILITY", {
    minPrice: 400,
    maxPrice: 500
  });

  console.dir(one.patch, { depth: null, colors: true });

  const two = update("INDOOR_FEATURES", [
    { id: 4, name: "Thing", slug: "thing" },
    { id: 5, name: "Another", slug: "another" }
  ]);

  console.dir(two.patch, { depth: null, colors: true });

  const three = update("BUDGET_AND_AVAILABILITY", {
    minPrice: 0
  });

  console.dir(three.patch, { depth: null, colors: true });

  const four = update("INDOOR_FEATURES", [
    { id: 5, name: "Another", slug: "another" }
  ]);

  console.dir(four.patch, { depth: null, colors: true });
});
