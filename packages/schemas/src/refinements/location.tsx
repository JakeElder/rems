import { txt } from "../utils";
import { z } from "zod";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({});

export const ArgsSchema = z.object({
  timeline: TimelineSchema
});

export const ReturnsSchema = z
  .object({
    o: z
      .string()
      .describe(
        txt(
          <>
            The search origin. This is the part of the users input that defines
            a fixed location. This should only be set to a fixed location. If
            only a relative adjustment has been made, IE "north 10km", then
            leave undefined.
          </>
        )
      )
  })
  .partial({ o: true })
  .transform(({ o }) => ({ origin: o }));
