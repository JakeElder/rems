import { z } from "zod";
import NlInputSchema from "../nl-input";
import { txt } from "../utils";
import { FilterSchema, IntentSchema, RealEstateQuerySchema } from "..";

export const ArgsSchema = z.tuple([NlInputSchema, RealEstateQuerySchema.URL]);

const CompressedFilter = z.lazy(() => FilterSchema.omit({ slug: true }));

export const ContextSchema = z.object({
  intents: z.lazy(() => z.array(IntentSchema)),
  indoorFeatures: z.lazy(() => z.array(CompressedFilter)),
  outdoorFeatures: z.lazy(() => z.array(CompressedFilter)),
  lotFeatures: z.lazy(() => z.array(CompressedFilter)),
  viewTypes: z.lazy(() => z.array(CompressedFilter)),
  propertyTypes: z.lazy(() => z.array(CompressedFilter)),
  currentQuery: z.object({
    LOCATION: RealEstateQuerySchema.Origin,
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

export const ReturnsSchema = z
  .object({
    i: z
      .array(IntentSchema.shape["id"])
      .describe(
        txt(
          <>
            An array of *Intents*. This contains an array of numerical id's that
            apply to this natural language. This must only include id's taken
            from the array of defined intents provided in the context.
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
  .transform(({ i }) => i);
