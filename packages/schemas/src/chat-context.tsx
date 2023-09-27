import z from "zod";

export const LanguageBasedContextEntrySchema = z.object({
  type: z.literal("MESSAGE"),
  role: z.enum(["USER", "ASSISTANT"]),
  date: z.number(),
  message: z.string()
});

export const ChatContextEntrySchema = z.discriminatedUnion("type", [
  LanguageBasedContextEntrySchema
]);

export const ChatContextSchema = z.array(ChatContextEntrySchema);
