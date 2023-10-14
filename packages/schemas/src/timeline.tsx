import { z } from "zod";
import {
  UserEventSchema,
  AssistantEventSchema,
  SystemEventSchema
} from "./event";

export const UserTimelineEventSchema = z.object({
  id: z.string(),
  date: z.number(),
  role: z.literal("USER"),
  event: UserEventSchema
});

export const AssistantTimelineEventSchema = z.object({
  id: z.string(),
  date: z.number(),
  role: z.literal("ASSISTANT"),
  event: AssistantEventSchema
});

export const SystemTimelineEventSchema = z.object({
  id: z.string(),
  date: z.number(),
  role: z.literal("SYSTEM"),
  event: SystemEventSchema
});

export const TimelineEventSchema = z.discriminatedUnion("role", [
  UserTimelineEventSchema,
  AssistantTimelineEventSchema,
  SystemTimelineEventSchema
]);

export const TimelineSchema = z.array(TimelineEventSchema);

`
- Timeline
  - TimelineEvent
    - LanguageBasedInteraction
    - PatchInteraction
      - ScalarPatch
        - ScalarDiff
      - ArrayPatch
        - ArrayDiff
`;
