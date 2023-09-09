import { z } from "zod";

export const GeneralUserMessageSchema = z.object({
  type: z.literal("GENERAL_MESSAGE"),
  response: z.string()
});

export const UserMessageSchema = z.discriminatedUnion("type", [
  GeneralUserMessageSchema
]);
