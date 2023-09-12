import { z } from "zod";
import NlInputSchema from "./nl-input";
import { AnalysisAssistantMessageSchema } from "./assistant-message";
import { ReactionSchema } from "./reaction";

const StandardInteractionSchema = z.object({
  input: NlInputSchema,
  analysis: AnalysisAssistantMessageSchema.omit({ type: true }),
  reactions: z.array(ReactionSchema)
});

export const RefineQueryInteraction = z
  .object({ type: z.literal("REFINE_QUERY") })
  .merge(StandardInteractionSchema);

export const NewQueryInteraction = z
  .object({ type: z.literal("NEW_QUERY") })
  .merge(StandardInteractionSchema);

export const InteractionSchema = z.discriminatedUnion("type", [
  RefineQueryInteraction,
  NewQueryInteraction
]);
