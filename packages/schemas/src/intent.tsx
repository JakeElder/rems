import { z } from "zod";
import md from "@rems/utils/md";

export const IntentCodeSchema = z
  .enum([
    "GET_ASSISTANTS_ATTENTION",
    "CHOOSE_ONE_PROPERTY",
    "COMPARE_PROPERTIES",
    "CHAT",
    "REFINE_LOCATION",
    "OBTAIN_GENERAL_INFORMATION",
    "REFINE_PAGE",
    "REFINE_SORT",
    "REFINE_SPACE_REQUIREMENTS",
    "REFINE_BUDGET_AVAILABILITY",
    "REFINE_INDOOR_FEATURES",
    "REFINE_OUTDOOR_FEATURES",
    "REFINE_LOT_FEATURES",
    "REFINE_VIEW_TYPES",
    "REFINE_PROPERTY_TYPES",
    "REQUEST_CLARIFICATION",
    "END_ASSISTANT_SESSION",
    "CLEAR_QUERY_COMPLETELY",
    "CLEAR_QUERY_PARTIALLY",
    "CHANGE_ASSISTANT_POSITION",
    "CHANGE_ASSISTANT_LANGUAGE",
    "QUERY_SELECTED_PROPERTIES",
    "GET_TRAVEL_DETAILS",
    "GET_NEARBY_PLACES",
    "FOCUS_SINGLE_PROPERTY"
  ])
  .describe(md(<>A unique identifier for the intent</>));

export const IntentSchema = z
  .object({
    id: z.number().min(1),
    code: IntentCodeSchema,
    description: z.string().describe(md(<>A description of the intent</>)),
    examples: z.array(z.string())
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
