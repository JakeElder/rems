import { z } from "zod";
import NlInputSchema from "./nl-input";
import { AnalysisAssistantMessageSchema } from "./assistant-message";
import { ReactionSchema } from "./reaction";
import { ChatContextSchema } from "./chat-context";

const StandardInteractionSchema = z.object({
  chatContext: ChatContextSchema,
  input: NlInputSchema,
  analysis: z.lazy(() => AnalysisAssistantMessageSchema.omit({ type: true })),
  reactions: z.array(ReactionSchema)
});

export const QueryModificationInteractionSchema = z
  .object({
    type: z.enum(["REFINE_QUERY", "NEW_QUERY", "CLEAR_QUERY"])
  })
  .merge(StandardInteractionSchema);

export const InteractionSchema = z.discriminatedUnion("type", [
  QueryModificationInteractionSchema
]);
