import { z } from "zod";
import NlInputSchema from "./nl-input";
import { AnalysisAssistantMessageSchema } from "./assistant-message";
import { ReactionSchema } from "./reaction";
import { Pagination } from "./real-estate-query";
import { txt } from "./utils";

const StandardInteractionSchema = z.object({
  input: NlInputSchema,
  analysis: AnalysisAssistantMessageSchema.omit({ type: true }),
  reactions: z.array(ReactionSchema)
});

export const QueryModificationInteractionSchema = z
  .object({
    type: z.enum(["REFINE_QUERY", "NEW_QUERY", "CLEAR_QUERY"]),
    result: z
      .object({ before: Pagination, after: Pagination })
      .describe(
        txt(
          <>
            The before/after pagination data for the query. Used to inform the
            user of how many results there now are (how many additional/fewer
            properties now match their query).
          </>
        )
      )
  })
  .merge(StandardInteractionSchema);

export const InteractionSchema = z.discriminatedUnion("type", [
  QueryModificationInteractionSchema
]);
