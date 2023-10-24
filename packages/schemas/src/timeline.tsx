import { z } from "zod";
import {
  UserEventSchema,
  AssistantEventSchema,
  SystemEventSchema
} from "./event";

export const UserTimelineEventSchema = z.object({
  role: z.literal("USER"),
  id: z.string(),
  date: z.number(),
  event: UserEventSchema
});

export const AssistantTimelineEventSchema = z.object({
  role: z.literal("ASSISTANT"),
  id: z.string(),
  date: z.number(),
  event: AssistantEventSchema
});

export const SystemTimelineEventSchema = z.object({
  role: z.literal("SYSTEM"),
  id: z.string(),
  date: z.number(),
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
