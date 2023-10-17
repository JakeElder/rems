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
    d: z
      .string()
      .describe(
        txt(
          <>
            The location description. Natural language location. IE "Phuket" or
            "The busiest BTS station in Bangkok".
          </>
        )
      ),
    r: Radius,
    re: z
      .boolean()
      .describe(txt(<>Whether the radius should be enabled or not</>))
  })
  .partial({ d: true, r: true, re: true })
  .transform(({ d, r, re }) => ({
    description: d,
    radius: r,
    radiusEnabled: re
  }));
