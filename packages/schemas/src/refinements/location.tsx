import { txt } from "../utils";
import { z } from "zod";
import { TimelineSchema } from "../timeline";
import { Radius } from "../location";

export const ContextSchema = z.object({});

export const ArgsSchema = z.object({
  timeline: TimelineSchema
});

export const ReturnsSchema = z
  .object({
    s: z
      .string()
      .describe(
        txt(
          <>
            The location source. Natural language location. IE "Phuket", "Within
            10km of the busiest BTS station in Bangkok".
          </>
        )
      ),
    r: Radius
  })
  .partial({ r: true })
  .transform(({ s, r }) => ({
    source: s,
    radius: r
  }));
