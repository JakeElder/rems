import { z } from "zod";
import { ChatContextSchema } from "./chat-context";
import * as RealEstateQuerySchema from "./real-estate-query";
import { AssistantStateSchema } from "./assistant-state";

export const AssistantPayloadSchema = z.object({
  chatContext: ChatContextSchema,
  query: RealEstateQuerySchema.Server,
  input: z.string(),
  state: AssistantStateSchema
});
