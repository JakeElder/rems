import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  timelineToCompletionMessages
} from "@/remi";
import { Refinements } from "@rems/schemas";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Z } from "@rems/types";

const { ArgsSchema, ReturnsSchema } = Refinements.Location;

type Args = Z<typeof ArgsSchema>;
type Returns = Z<typeof ReturnsSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Returns>>;

const location: Fn = async ({ timeline }) => {
  const request: ChatCompletionRequest = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            You are Remi, an assistant responsible for helping the user of a
            real estate website. Your task is to process their input and
            identify the "search origin" based on chat.
          </>
        )
      },
      ...timelineToCompletionMessages(timeline)
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        parameters: zodToJsonSchema(Refinements.Location.ReturnsSchema)
      }
    ]
  };

  return execute(request, ReturnsSchema);
};

export default location;
