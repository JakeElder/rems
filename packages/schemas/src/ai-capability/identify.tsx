import { z } from "zod";
import NlInputSchema from "../nl-input";
import { txt } from "../utils";
import { TerseCapabilitySchema } from "../capability";

export const ArgsSchema = z.tuple([NlInputSchema]);

export const ContextSchema = z.object({
  capabilities: z.lazy(() => z.array(TerseCapabilitySchema)),
  indoorFeatures: z.array(z.string()),
  outdoorFeatures: z.array(z.string()),
  lotFeatures: z.array(z.string()),
  viewTypes: z.array(z.string()),
  propertyTypes: z.array(z.string()),
  queryStructure: z
    .object({
      LOCATION: z.record(z.any()),
      MAP_STATE: z.record(z.any()),
      PAGE: z.record(z.any()),
      SORT: z.record(z.any()),
      SPACE_REQUIREMENTS: z.record(z.any()),
      BUDGET_AND_AVAILABILITY: z.record(z.any()),
      INDOOR_FEATURES: z.record(z.any()),
      LOT_FEATURES: z.record(z.any()),
      OUTDOOR_FEATURES: z.record(z.any()),
      PROPERTY_TYPES: z.record(z.any()),
      VIEW_TYPES: z.record(z.any())
    })
    .describe(txt(<>The JSON schema of the query object the user can set</>))
});

export const ReturnsSchema = z
  .object({
    c: TerseCapabilitySchema.shape["id"].describe(
      txt(
        <>
          The id of the *Capability* that is best suited to service the user, .
          It must be the id of a single capability from our defined set.
        </>
      )
    )
  })
  .transform(({ c }) => c);
