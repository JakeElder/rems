import { txt } from "./utils";
import { z } from "zod";
import {
  MIN_LIVING_AREA_SIZES,
  MAX_LIVING_AREA_SIZES,
  MIN_LOT_SIZES,
  MAX_LOT_SIZES
} from "./constants";

export const Arrays = z.object({
  "indoor-features": z.string().array().default([]).catch([]),
  "lot-features": z.string().array().default([]).catch([]),
  "outdoor-features": z.string().array().default([]).catch([]),
  "property-types": z.string().array().default([]).catch([]),
  "view-types": z.string().array().default([]).catch([])
});

export const BudgetAndAvailability = z.object({
  "min-price": z.coerce.number().default(0).catch(0),
  "max-price": z.coerce.number().nullable().default(null).catch(null),
  availability: z.enum(["sale", "rent", "any"]).default("sale").catch("sale")
});

export const PageAndSort = z.object({
  page: z.coerce.number().default(1).catch(1),
  sort: z
    .enum([
      "newest-first",
      "lowest-price-first",
      "highest-price-first",
      "smallest-living-area-first",
      "largest-living-area-first"
    ])
    .default("newest-first")
    .catch("newest-first")
});

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

export const Origin = z.object({
  "origin-lat": z.coerce.number().default(13.736717).catch(13.736717),
  "origin-lng": z.coerce.number().default(100.523186).catch(100.523186),
  "origin-id": z
    .string()
    .default("ChIJ82ENKDJgHTERIEjiXbIAAQE")
    .catch("ChIJ82ENKDJgHTERIEjiXbIAAQE")
});

export const MapState = z.object({
  radius: z.coerce
    .number()
    .min(1000)
    .max(20_000)
    .default(5000)
    .catch(5000)
    .describe(
      txt(
        <>
          The radius from the search origin, defining the area to search for
          properties within. It should be specified in meters squared.
        </>
      )
    ),
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
    ),
  zoom: z.coerce
    .number()
    .min(0)
    .max(22)
    .default(9)
    .catch(9)
    .describe(txt(<>The zoom level of the map. A number between 0 and 22.</>)),
  lat: z.coerce
    .number()
    .nullable()
    .default(13.736717)
    .catch(13.736717)
    .describe(txt(<>The current latitude of the center point of the map.</>)),
  lng: z.coerce
    .number()
    .nullable()
    .default(100.523186)
    .catch(100.523186)
    .describe(txt(<>The current longitude of the center point of the map.</>))
});

export const Scalars = z
  .object({})
  .merge(BudgetAndAvailability)
  .merge(PageAndSort)
  .merge(SpaceRequirements)
  .merge(Origin)
  .merge(MapState);

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
