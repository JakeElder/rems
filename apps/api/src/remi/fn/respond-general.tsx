import {
  execute,
  stringify,
  timelineToCompletionMessages,
  txt
} from "@/remi/utils";
import { ChatCompletionRequest, RemiResponse } from "@/remi/types";
import { Capabilities } from "@rems/schemas";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Z } from "@rems/types";

const { ArgsSchema, ReturnsSchema, ContextSchema } =
  Capabilities.RespondGeneral;

type Args = Z<typeof ArgsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Returns>>;

const analyze: Fn = async ({ timeline, capabilities, query }) => {
  const context = stringify<Context>({
    capabilities: capabilities.map(({ id, code }) => ({ id, code })),
    query
  });

  const request: ChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You are Remi, a Thai born, bi-lingual assistant responsible for
              helping the user of a real estate website.
            </p>
            <p>
              Sometimes the user may ask general questions, potentially not
              related to properties. It is your task to chat with the user,
              giving information where you can.
            </p>
            <p>Context will follow</p>
          </>
        )
      },
      {
        role: "system",
        content: context
      },
      ...timelineToCompletionMessages(timeline)
    ],
    function_call: { name: "f" },
    functions: [{ name: "f", parameters: zodToJsonSchema(ReturnsSchema) }]
  };

  return execute.fn(request, ReturnsSchema);
};

export default analyze;
