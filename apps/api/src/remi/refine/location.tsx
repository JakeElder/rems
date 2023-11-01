import { RemiResponse } from "@/remi/types";
import { execute, timelineToCompletionMessages } from "@/remi/utils";
import md from "@rems/utils/md";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { TimelineSchema } from "@rems/schemas";
import { Z } from "@rems/types";
import { z } from "zod";

const PropsSchema = z.object({
  timeline: TimelineSchema
});

const ReturnsSchema = z
  .object({
    d: z
      .string()
      .describe(
        md(
          <>
            The location description. Natural language location. IE "in Phuket"
            or "near the busiest BTS station in Bangkok". Includes geospatial
            operators like "in" "near", "around".
          </>
        )
      ),
    r: z.number().describe(md(<>Radius, if specified</>))
  })
  .partial({ d: true, r: true })
  .transform(({ d, r }) => ({ description: d, radius: r }));

type Props = Z<typeof PropsSchema>;
type Returns = Z<typeof ReturnsSchema>;

const location = async ({
  timeline
}: Props): Promise<RemiResponse<Returns>> => {
  const request = $request({
    ...$model("gpt-3.5-turbo"),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You are an assistant responsible for helping the user of a real
            estate website. Process their input and extract location
            information.
          </p>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default location;
