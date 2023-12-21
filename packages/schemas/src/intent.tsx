import { z } from "zod";
import md from "@rems/utils/md";

export const IntentCodeSchema = z
  .enum([
    "CHAT",
    "REFINE_LOCATION",
    "UNKNOWN",
    "OBTAIN_GENERAL_INFORMATION",
    "REFINE_PAGE",
    "REFINE_SORT",
    "REFINE_SPACE_REQUIREMENTS",
    "REFINE_BUDGET_AVAILABILITY",

    // "REFINE_INDOOR_FEATURES",
    // "REFINE_OUTDOOR_FEATURES",
    // "REFINE_LOT_FEATURES",
    // "REFINE_VIEW_TYPES",
    // "REFINE_PROPERTY_TYPES",
    // "REFINE_MAP_STATE"
  ])
  .describe(md(<>A unique identifier for the intent</>));

export const IntentSchema = z
  .object({
    id: z.number().min(1),
    code: IntentCodeSchema,
    requiresWork: z.boolean(),
    description: z.string().describe(md(<>A description of the intent</>)),
    examples: z.array(
      z.object({
        input: z
          .string()
          .describe(md(<>An example command/enquiry issued by a user</>)),
        matches: z
          .array(z.string())
          .describe(md(<>An array of substrings that match this intent</>))
      })
    )
  })
  .describe(
    md(
      <>
        Remi is a virtual assistant. She analyses user intents so that we may
        provide them with good user experience and perform actions on their
        behalf. This object describes an intent that we are able to fulfill.
      </>
    )
  );

export const TerseIntentSchema = IntentSchema.pick({ id: true, code: true });
