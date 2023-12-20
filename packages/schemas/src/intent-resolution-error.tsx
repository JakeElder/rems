import { z } from "zod";
import { IntentCodeSchema } from "./intent";

export const IntentResolutionErrorSchema = z.object({
  intent: IntentCodeSchema,
  error: z.any()
});

export default IntentResolutionErrorSchema;
