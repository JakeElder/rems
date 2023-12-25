import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, timelineToCompletionMessages } from "@/remi/utils";
import { LatLngSchema, TimelineSchema } from "@rems/schemas";
import { z } from "zod";
import md from "@rems/utils/md";

const PropsSchema = z.object({
  timeline: TimelineSchema
});

const ReturnsSchema = z
  .object({
    l: LatLngSchema.describe(
      md(<>The lat/lng location from which to get nearby places</>)
    ),
    k: z
      .string()
      .describe(
        md(
          <>
            Keyword. Ie the type of nearby locations the user is interested in.
            IE "coffee shops", "airports"
          </>
        )
      )
  })
  .transform(({ l, k }) => ({ location: l, keyword: k }));

type Props = z.infer<typeof PropsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;

const parseNarbyPlacesDetails = async ({
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
            Your current task is to extract the lng/lat details of the origin
            from which the user would like to find nearby places
          </p>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default parseNarbyPlacesDetails;
