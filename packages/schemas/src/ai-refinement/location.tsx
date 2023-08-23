import { txt } from "../utils";
import { z } from "zod";
import NlInputSchema from "../nl-input";

export const ArgsSchema = z.tuple([NlInputSchema]);

export const ReturnsSchema = z
  .object({
    o: z
      .string()
      .nullable()
      .catch(null)
      .describe(
        txt(
          <>
            The search origin. This is the part of the users input that defines
            a *fixed* location. This can be left null if no location has been
            specified. This should only be set to a fixed location. If only a
            relative adjustment has been made, IE "north 10km", then this value
            should be null.
          </>
        )
      ),
    c: z
      .number()
      .min(0)
      .max(1)
      .catch(0)
      .describe(
        txt(
          <>
            The confidence level as to whether or not a location has been
            specified. 0 meaning there is no confidence in our assement, 1
            meaning we are 100% confident that we have made the correct
            assessment.
          </>
        )
      )
  })
  .partial({ o: true })
  .transform(({ o, c }) => ({
    origin: o,
    confidence: c
  }));
