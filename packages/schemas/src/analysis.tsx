import { z } from "zod";
import { IntentCodeSchema } from "./intent";

export const AnalysisSchema = z.object({
  intents: z.array(IntentCodeSchema)
});

export default AnalysisSchema;
