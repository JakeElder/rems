import { z } from "zod";
import { txt } from "./utils";

export const Radius = z.coerce
  .number()
  .min(1000)
  .max(50_000)
  .default(5000)
  .catch(5000)
  .describe(
    txt(
      <>
        The radius from the search source to search for properties within.
        Specified in M².
      </>
    )
  );

export const NlLocationSourceSchema = z.object({
  type: z.literal("NL").default("NL"),
  source: z.string(),
  radius: Radius.nullable().default(null)
});

export const LatLngLocationSourceSchema = z.object({
  type: z.literal("LAT_LNG").default("LAT_LNG"),
  source: z.object({ lat: z.number(), lng: z.number() }),
  radius: Radius.nullable().default(null)
});

export const LocationSourceSchema = z.discriminatedUnion("type", [
  NlLocationSourceSchema,
  LatLngLocationSourceSchema
]);

const ViewportSchema = z.object({
  sw: z.object({ lat: z.number(), lng: z.number() }),
  ne: z.object({ lat: z.number(), lng: z.number() })
});

export const LocationResolutionSchema = z
  .object({
    id: z.string(),
    lat: z.number(),
    lng: z.number(),
    viewport: ViewportSchema,
    displayName: z.string(),
    editorialSummary: z.string()
  })
  .partial({
    displayName: true,
    editorialSummary: true,
    viewport: true
  });

export const LocationSchema = z.object({
  source: LocationSourceSchema,
  resolution: LocationResolutionSchema
});
