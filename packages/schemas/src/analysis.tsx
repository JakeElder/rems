import { z } from "zod";
import { IntentCodeSchema } from "./intent";
import { CapabilityCodeSchema } from "./capability";

export const AnalysisSchema = z.object({
  intents: z.array(IntentCodeSchema),
  capability: CapabilityCodeSchema
});
