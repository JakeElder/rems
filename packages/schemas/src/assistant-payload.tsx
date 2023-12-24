import { z } from "zod";
import { AppStateSchema } from "./app-state";
import { PropertySchema } from "./property";

export const AssistantPayloadSchema = z.object({
  state: AppStateSchema,
  properties: z.array(PropertySchema.shape["id"])
});
