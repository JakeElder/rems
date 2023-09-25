import { z } from "zod";
import { txt } from "../utils";
import { InteractionSchema } from "../interaction";

export const ArgsSchema = z.tuple([InteractionSchema]);

export const ContextSchema = z.object({
  interaction: InteractionSchema
});

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
