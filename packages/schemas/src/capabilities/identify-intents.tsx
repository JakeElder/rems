import { z } from "zod";
import { txt } from "../utils";
import { LocationSchema, RealEstateQuerySchema, TimelineSchema } from "..";
import { TerseIntentSchema } from "../intent";

export const ContextSchema = z.object({
  primaryIntents: z.lazy(() => z.array(TerseIntentSchema)),
  secondaryIntents: z.lazy(() => z.array(TerseIntentSchema)),
  indoorFeatures: z.array(z.string()),
  outdoorFeatures: z.array(z.string()),
  lotFeatures: z.array(z.string()),
  viewTypes: z.array(z.string()),
  propertyTypes: z.array(z.string()),
  currentLocation: LocationSchema,
  currentQuery: z.object({
    MAP_STATE: RealEstateQuerySchema.MapState,
    PAGE: RealEstateQuerySchema.Page,
    SORT: RealEstateQuerySchema.Sort,
    SPACE_REQUIREMENTS: RealEstateQuerySchema.SpaceRequirements,
    BUDGET_AND_AVAILABILITY: RealEstateQuerySchema.BudgetAndAvailability,
    INDOOR_FEATURES: RealEstateQuerySchema.Arrays.shape["indoor-features"],
    LOT_FEATURES: RealEstateQuerySchema.Arrays.shape["lot-features"],
    OUTDOOR_FEATURES: RealEstateQuerySchema.Arrays.shape["outdoor-features"],
    PROPERTY_TYPES: RealEstateQuerySchema.Arrays.shape["property-types"],
    VIEW_TYPES: RealEstateQuerySchema.Arrays.shape["view-types"]
  })
});

export const ArgsSchema = z.object({
  timeline: TimelineSchema,
  query: RealEstateQuerySchema.Server
});

export const ReturnsSchema = z
  .object({
    p: TerseIntentSchema.shape["id"].describe(txt(<>The *primary* intent</>)),
    s: z
      .array(TerseIntentSchema.shape["id"])
      .describe(
        txt(
          <>
            An array of *Secondary Intents*. An array of id's that apply to this
            request.
          </>
        )
      )
  })
  .describe(
    txt(
      <>
        An object that contains all the data necessary to further process
        natural language issued to Remi as a command or enquiry.
      </>
    )
  )
  .transform(({ p, s }) => ({ primary: p, secondary: s }));
