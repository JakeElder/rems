import { z } from "zod";
import { txt } from "./utils";

export const IntentSchema = z
  .object({
    id: z.number().min(1),
    name: z.string(),
    code: z.string().describe(txt(<>A unique identifier for the intent</>)),
    description: z.string().describe(txt(<>A description of the intent</>)),
    examples: z.array(
      z.object({
        input: z
          .string()
          .describe(txt(<>An example command/enquiry issued by a user</>)),
        matches: z
          .array(z.string())
          .describe(txt(<>An array of substrings that match this intent</>))
      })
    )
  })
  .describe(
    txt(
      <>
        Remi is a virtual assistant. She analyses user intents so that we may
        provide them with good user experience and perform actions on their
        behalf. This object describes an intent that we are able to fulfill.
      </>
    )
  );
