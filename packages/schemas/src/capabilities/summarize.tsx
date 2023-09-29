import { z } from "zod";
import { txt } from "../utils";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({ timeline: TimelineSchema });

export const ArgsSchema = ContextSchema;

export const ReturnsSchema = z
  .object({
    r: z
      .string()
      .describe(
        txt(
          <>
            The natural language response to be sent to the user, sent as "Remi"
          </>
        )
      )
  })
  .transform(({ r }) => r);
