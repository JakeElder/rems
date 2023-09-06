import { CapabilityCodeSchema } from "../capability";
import { IntentCodeSchema } from "../intent";
import { IntentResolutionSchema } from "../intent-resolution";
import NlInputSchema from "../nl-input";
import { z } from "zod";

export const SummarySchema = z.object({
  input: NlInputSchema,
  intents: z.array(IntentCodeSchema),
  capability: CapabilityCodeSchema,
  resolutions: z.array(IntentResolutionSchema)
});
