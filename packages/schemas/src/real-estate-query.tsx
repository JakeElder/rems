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
    availability: z.enum(["sale", "rent"]).default("sale").catch("sale"),
    "min-lot-size": z.coerce.number().default(0).catch(0),
    "max-lot-size": z.coerce.number().nullable().default(null).catch(null)
  });

export const RealEstateQuerySchema = base().extend({
  "search-origin-lat": z.coerce.number().nullable().default(null).catch(null),
  "search-origin-long": z.coerce.number().nullable().default(null).catch(null),
  "search-radius": z.coerce.number().nullable().default(null).catch(null),
  "search-origin-id": z.coerce.number().nullable().default(null).catch(null),
  "nearest-mrt-station": z.string().nullable().default(null).catch(null),
  "nearest-bts-station": z.string().nullable().default(null).catch(null),
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
    ),
  "search-proximity": z
    .string()
    .nullable()
    .default(null)
    .catch(null)
    .describe(
      txt(
        <>
          A natural language range from which properties should be within in
          relation from the search origin. Could be "near", "close to", "within
          walking distance", etc
        </>
      )
    ),
  "search-radius": z
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

export const PartialRealEstateQuerySchema = RealEstateQuerySchema.partial();
export const PartialAiRealEstateQuerySchema = AiRealEstateQuerySchema.partial();
