import { ChatCompletionRequest, RemiResponse } from "@/remi/types";
import { execute, timelineToCompletionMessages, txt } from "@/remi/utils";
import { Timeline, Z } from "@rems/types";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

type Props = {
  timeline: Timeline;
};

const ReturnsSchema = z
  .object({
    d: z
      .string()
      .describe(
        txt(
          <>
            The location description. Natural language location. IE "in Phuket"
            or "near the busiest BTS station in Bangkok". Includes geospatial
            operators like "in" "near", "around".
          </>
        )
      ),
    r: z.number().describe(txt(<>Radius, if specified</>))
  })
  .partial({ d: true, r: true })
  .transform(({ d, r }) => ({ description: d, radius: r }));

type Returns = Z<typeof ReturnsSchema>;

const location = async ({
  timeline
}: Props): Promise<RemiResponse<Returns>> => {
  const request: ChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You are an assistant responsible for helping the user of a real
              estate website. Process their input and extract location
              information.
            </p>
          </>
        )
      },
      ...timelineToCompletionMessages(timeline)
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute.fn(request, ReturnsSchema);
};

export default location;
