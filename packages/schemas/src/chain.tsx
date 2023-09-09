import { z } from "zod";
import { GeneralResponseAssistantMessageSchema } from "./assistant-message";
import { GeneralUserMessageSchema } from "./user-message";
import { txt } from "./utils";

export const GeneralMessageSchema = z.object({
  timestamp: z.date(),
  message: z.union([
    GeneralResponseAssistantMessageSchema,
    GeneralUserMessageSchema
  ])
});

export const ChainSchema = z
  .array(GeneralMessageSchema)
  .describe(
    txt(
      <>
        The current chain of messages between the assistant and the user. This
        is included as capabilities and reactions can be inferred and generated
        based on previous context in the conversation.
      </>
    )
  );
