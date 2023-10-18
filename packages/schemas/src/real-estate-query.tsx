import { txt } from "./utils";
import { z } from "zod";
import {
  MIN_LIVING_AREA_SIZES,
  MAX_LIVING_AREA_SIZES,
  MIN_LOT_SIZES,
  MAX_LOT_SIZES,
  MAX_RENTAL_PRICE,
  MAX_PURCHASE_PRICE
} from "./constants";

export const Arrays = z.object({
  "indoor-features": z.string().array().default([]).catch([]),
  "lot-features": z.string().array().default([]).catch([]),
  "outdoor-features": z.string().array().default([]).catch([]),
  "property-types": z.string().array().default([]).catch([]),
  "view-types": z.string().array().default([]).catch([])
});

export const BudgetAndAvailability = z.object({
  "min-price": z.coerce
    .number()
    .default(0)
    .catch(0)
    .describe(
      txt(
        <>
          Minimum Price. When browsing rental properties, this is the minimum
          amount of money the user would like to spend per month. When browsing
          sale properties, this is the minimum amount in the users budget to
          purchase a property outright.
        </>
      )
    ),
  "max-price": z.coerce
    .number()
    .nullable()
    .default(null)
    .catch(null)
    .describe(
      txt(
        <>
          Minimum Price. When browsing rental properties, this is the maximum
          amount of money the user would like to spend per month. The *maximum
          possible value* is {MAX_RENTAL_PRICE}. When browsing sale properties,
          this is the maximum amount in the users budget to purchase a property
          outright. The *maximum possible value* is {MAX_PURCHASE_PRICE}.
        </>
      )
    ),
  availability: z
    .enum(["sale", "rent", "any"])
    .default("sale")
    .catch("sale")
    .describe(
      txt(
        <>
          Availability. Whether the user is looking to buy or rent. This should
          be set to "rent" if the user specifies a monthly budget.
        </>
      )
    )
});

export const Page = z.coerce
  .number()
  .default(1)
  .catch(1)
  .describe(txt(<>The page to show</>));

export const Sort = z
  .enum([
    "newest-first",
    "lowest-price-first",
    "highest-price-first",
    "smallest-living-area-first",
    "largest-living-area-first"
  ])
  .default("newest-first")
  .catch("newest-first");

export const SpaceRequirements = z.object({
  "min-bedrooms": z.coerce
    .number()
    .default(0)
    .catch(0)
    .describe(txt(<>Minimum number of bedrooms</>)),
  "max-bedrooms": z.coerce
    .number()
    .nullable()
    .default(null)
    .catch(null)
    .describe(
      txt(
        <>
          Maximum Bedrooms. This can be null when the user doesn't specify a
          range, in which case properties with any amount of bedrooms greater
          than the minimum will be shown.
        </>
      )
    ),
  "min-bathrooms": z.coerce
    .number()
    .default(0)
    .catch(0)
    .describe(txt(<>Minimum number of bathrooms</>)),
  "min-living-area": z.coerce
    .number()
    .default(0)
    .catch(0)
    .describe(
      txt(
        <>
          The minimum living area size, specified in Meters Squared. Here are
          the possible values: `
          {JSON.stringify(MIN_LIVING_AREA_SIZES.map((s) => s.value))}`. The user
          may *only select one of these values*. When the user specifies a value
          other than these, the closest match should be used.
        </>
      )
    ),
  "max-living-area": z.coerce
    .number()
    .nullable()
    .default(null)
    .catch(null)
    .describe(
      txt(
        <>
          The maximum living area size, specified in Meters Squared. Here are
          the possible values: `
          {JSON.stringify(MAX_LIVING_AREA_SIZES.map((s) => s.value))}`. The user
          may *only select one of these values*. When the user specifies a value
          other than these, the closest match should be used.
        </>
      )
    ),
  "min-lot-size": z.coerce
    .number()
    .default(0)
    .catch(0)
    .describe(
      txt(
        <>
          The minimum lot size, specified in Meters Squared. Here are the
          possible values: `{JSON.stringify(MIN_LOT_SIZES.map((s) => s.value))}
          `. The user may *only select one of these values*. When the user
          specifies a value other than these, the closest match should be used.
        </>
      )
    ),
  "max-lot-size": z.coerce
    .number()
    .nullable()
    .default(null)
    .catch(null)
    .describe(
      txt(
        <>
          The maximum lot size, specified in Meters Squared. Here are the
          possible values: `{JSON.stringify(MAX_LOT_SIZES.map((s) => s.value))}
          `. The user may *only select one of these values*. When the user
          specifies a value other than these, the closest match should be used.
        </>
      )
    )
});

export const Location = z.object({
  "location-source": z.string().catch("Bangkok").default("Bangkok"),
  "location-source-type": z.enum(["nl", "ll"]).catch("nl").default("nl"),
  "location-geospatial-operator": z
    .string()
    .nullable()
    .catch(null)
    .default(null),
  radius: z.coerce
    .number()
    .min(1000)
    .max(100_000)
    .default(10_000)
    .catch(10_000)
    .describe(txt(<>The property search radius in M².</>)),
  "radius-enabled": z
    .enum(["true", "false"])
    .default("false")
    .catch("false")
    .describe(
      txt(
        <>
          When true, the specified search radius will be drawn on the map from
          the search origin. Only properties within this radius will be shown.
        </>
      )
    )
});

export const MapState = z.object({
  zoom: z.coerce
    .number()
    .min(0)
    .max(22)
    .default(9)
    .catch(9)
    .describe(txt(<>The zoom level of the map. A number between 0 and 22.</>))
});

export const Scalars = z
  .object({
    page: Page,
    sort: Sort
  })
  .merge(BudgetAndAvailability)
  .merge(SpaceRequirements)
  .merge(MapState)
  .merge(Location);

export const Group = z.enum([
  "LOCATION",
  "MAP_STATE",
  "PAGE",
  "SORT",
  "SPACE_REQUIREMENTS",
  "BUDGET_AND_AVAILABILITY",
  "INDOOR_FEATURES",
  "LOT_FEATURES",
  "OUTDOOR_FEATURES",
  "PROPERTY_TYPES",
  "VIEW_TYPES"
]);

export const URL = z.object({}).merge(Arrays).merge(Scalars);

export const Server = z
  .object({
    "map-bound-sw-lng": z.coerce.number().nullable().default(null),
    "map-bound-sw-lat": z.coerce.number().nullable().default(null),
    "map-bound-ne-lng": z.coerce.number().nullable().default(null),
    "map-bound-ne-lat": z.coerce.number().nullable().default(null),
    limit: z.enum(["true", "false"]).default("true").catch("true")
  })
  .merge(URL);

export const Pagination = z.object({
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
  total: z.number()
});
