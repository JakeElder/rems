import React from "react";
import { z } from "zod";

const txt = (node: React.ReactElement): string => node.props.children;

const base = () =>
  z.object({
    "indoor-features": z.string().array().default([]).catch([]),
    "lot-features": z.string().array().default([]).catch([]),
    "outdoor-features": z.string().array().default([]).catch([]),
    "property-type": z.string().array().default([]).catch([]),
    "view-types": z.string().array().default([]).catch([]),
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
      .catch("newest-first"),
    "min-price": z.coerce.number().default(0).catch(0),
    "max-price": z.coerce.number().nullable().default(null).catch(null),
    "min-bedrooms": z.coerce.number().default(0).catch(0),
    "max-bedrooms": z.coerce.number().nullable().default(null).catch(null),
    "min-bathrooms": z.coerce.number().default(0).catch(0),
    "min-living-area": z.coerce.number().default(0).catch(0),
    "max-living-area": z.coerce.number().nullable().default(null).catch(null),
    availability: z.enum(["sale", "rent", "any"]).default("sale").catch("sale"),
    "min-lot-size": z.coerce.number().default(0).catch(0),
    "max-lot-size": z.coerce.number().nullable().default(null).catch(null),
    "search-radius": z.coerce
      .number()
      .default(2000)
      .catch(2000)
      .describe(
        txt(
          <>
            The radius from `search-origin`, defining the area to search for
            properties within. It should be specified in meters squared.
          </>
        )
      ),
    "search-radius-enabled": z
      .enum(["true", "false"])
      .default("false")
      .catch("false"),
    "search-origin-lat": z.coerce.number().default(13.736717).catch(13.736717),
    "search-origin-lng": z.coerce
      .number()
      .default(100.523186)
      .catch(100.523186),
    "map-zoom": z.coerce
      .number()
      .default(9)
      .catch(9)
      .describe(txt(<>The zoom level of the map. A number between 0 and 22</>))
  });

export const RealEstateQuerySchema = base().extend({
  "search-origin-id": z
    .string()
    .default("ChIJ82ENKDJgHTERIEjiXbIAAQE")
    .catch("ChIJ82ENKDJgHTERIEjiXbIAAQE"),
  "nearest-mrt-station": z.string().nullable().default(null).catch(null),
  "nearest-bts-station": z.string().nullable().default(null).catch(null),
  "map-lat": z.coerce.number().nullable().default(13.736717).catch(13.736717),
  "map-lng": z.coerce.number().nullable().default(100.523186).catch(100.523186),
  area: z.string().nullable().default(null).catch(null)
});

export const AiRealEstateQuerySchema = base().extend({
  "search-origin": z
    .string()
    .nullable()
    .default(null)
    .catch(null)
    .describe(
      txt(
        <>
          A natural language description of the location from which properties
          should be near
        </>
      )
    )
});

export const ServerRealEstateQuerySchema = RealEstateQuerySchema.extend({
  "map-bound-sw-lng": z.coerce.number().nullable().default(null),
  "map-bound-sw-lat": z.coerce.number().nullable().default(null),
  "map-bound-ne-lng": z.coerce.number().nullable().default(null),
  "map-bound-ne-lat": z.coerce.number().nullable().default(null),
  limit: z.enum(["true", "false"]).default("true").catch("true")
}).omit({
  "map-zoom": true,
  "map-lng": true,
  "map-lat": true
});

export const PartialServerRealEstateQuerySchema =
  ServerRealEstateQuerySchema.partial();

export const PartialRealEstateQuerySchema = RealEstateQuerySchema.partial();
export const PartialAiRealEstateQuerySchema = AiRealEstateQuerySchema.partial();
