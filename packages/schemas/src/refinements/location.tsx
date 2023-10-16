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
            The location source. Natural language location. IE "Phuket" or
            "Within 10km of the busiest BTS station in Bangkok".
          </>
        )
      ),
    r: Radius,
    re: z
      .boolean()
      .describe(txt(<>Whether the radius should be enabled or not</>))
  })
  .partial({ s: true, r: true })
  .transform(({ s, r, re }) => ({ source: s, radius: r, radiusEnabled: re }));
