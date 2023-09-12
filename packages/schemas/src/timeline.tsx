import { z } from "zod";
import { UserInteractionSchema } from "./user-interaction";
import { AssistantMessageSchema } from "./assistant-message";

export const UserTimelineEventSchema = z.object({
  id: z.string(),
  type: z.literal("USER"),
  date: z.number(),
  interaction: UserInteractionSchema
});

export const AssistantTimelineEventSchema = z.object({
  id: z.string(),
  type: z.literal("ASSISTANT"),
  date: z.number(),
  message: AssistantMessageSchema
});

export const TimelineEventSchema = z.discriminatedUnion("type", [
  UserTimelineEventSchema,
  AssistantTimelineEventSchema
]);

export const TimelineSchema = z.array(TimelineEventSchema);

`
- TimelineSchema
  - UserTimelineEventSchema
    - UserInteractionSchema
      - UserVerbalInteractionSchema
      - UserWrittenInteractionSchema
      - UserPatchInteractionSchema
        - ScalarPatchSchema
          - ScalarDiffSchema
        - ArrayPatchSchema
          - ArrayDiffSchema
    - AssistantMessageSchema
      - AnalysisAssistantMessageSchema
      - ReactionAssistantMessageSchema
        - PatchReactionSchema
          - ScalarPatchSchema
            - ScalarDiffSchema
          - ArrayPatchSchema
            - ArrayDiffSchema
        - VerbalReactionSchema
      - SummaryAssistantMessageSchema
  - AssistantTimelineEventSchema
`
