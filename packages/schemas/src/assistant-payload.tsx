import { z } from "zod";
import { AppStateSchema } from "./app-state";

export const AssistantPayloadSchema = z.object({
  state: AppStateSchema
});
