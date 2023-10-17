import { txt } from "../utils";
import { z } from "zod";
import { TimelineSchema } from "../timeline";

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
    go: z
      .string()
      .describe(
        txt(
          <>
            Geospatial Operator. IE "in", "around", "near", "within $x km of".
            Lower case. Provide a default when there is a description but no
            operator specified.
          </>
        )
      ),
    r: z.number().describe(txt(<>Radius</>)),
    re: z
      .boolean()
      .describe(txt(<>Whether the radius should be enabled or not</>))
  })
  .partial({ d: true, r: true, re: true, go: true })
  .transform(({ d, r, re, go }) => ({
    description: d,
    radius: r,
    radiusEnabled: re,
    geospatialOperator: go
  }));
