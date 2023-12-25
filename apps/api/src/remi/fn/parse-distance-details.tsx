import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, timelineToCompletionMessages } from "@/remi/utils";
import { TimelineSchema } from "@rems/schemas";
import { z } from "zod";
import md from "@rems/utils/md";

const PropsSchema = z.object({
  timeline: TimelineSchema
});

const ReturnsSchema = z
  .object({
    o: z
      .string()
      .describe(md(<>The origin point from which to get directions from</>))
      .optional(),
    oll: z
      .object({
        lat: z.number(),
        lng: z.number()
      })
      .optional()
      .describe(
        md(<>The lat/lng origin point from which to get directions from</>)
      )
      .optional(),
    d: z.string().describe(md(<>The destination</>))
  })
  .transform(({ o, oll, d }) => ({
    origin: o,
    originLngLat: oll,
    destination: d
  }));

type Props = z.infer<typeof PropsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;

const chooseOneProperty = async ({
  timeline
}: Props): Promise<RemiResponse<Returns>> => {
  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You are Remi, a terse, cute, witty, female, Thai born, bi-lingual
            (Thai, English) assistant responsible for helping the user of a real
            estate website.
          </p>
          <p>
            Your current task is to get distance details. For now, just extract
            the starting point and destination. The starting point can be
            lng/lat values.
          </p>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default chooseOneProperty;
