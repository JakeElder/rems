import { z } from "zod";

export const AssistantStateSchema = z.enum([
  "SLEEPING",
  "LISTENING",
  "THINKING",
  "REFINING_QUERY",
  "CLEARING_QUERY",
  "OPENING",
  "CHATTING"
]);
