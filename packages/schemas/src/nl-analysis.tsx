import { z } from "zod";
import NlInputSchema from "./nl-input";
import { txt } from "./utils";
import {
  IndoorFeature,
  IntentSchema,
  LotFeature,
  OutdoorFeature,
  PropertyType,
  ViewType
} from ".";

export const ArgsSchema = z.tuple([NlInputSchema]);

export const ContextSchema = z.object({
  intents: z.lazy(() => z.array(IntentSchema)),
  indoorFeatures: z.lazy(() => z.array(IndoorFeature)),
  outdoorFeatures: z.lazy(() => z.array(OutdoorFeature)),
  lotFeatures: z.lazy(() => z.array(LotFeature)),
  viewTypes: z.lazy(() => z.array(ViewType)),
  propertyTypes: z.lazy(() => z.array(PropertyType))
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
  );
