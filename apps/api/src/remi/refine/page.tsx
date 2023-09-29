import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  stringify
} from "@/remi";
import { Refinements } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const { ArgsSchema, ReturnsSchema, ContextSchema } = Refinements.Page;

type Args = z.infer<typeof ArgsSchema>;
type Context = z.infer<typeof ContextSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Returns>>;

const page: Fn = async ({ timeline, current }) => {
  const context = stringify<Context>({ timeline, current });
  const schema = stringify(zodToJsonSchema(ContextSchema));

  const request: ChatCompletionRequest = {
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You an assistant responsible for helping the user of a real estate
              website. Process their input and update the current page
            </p>
            <p>Useful context: `{context}`</p>
            <p>The context schema: `{schema}`</p>
          </>
        )
      }
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        description: txt(<>Updates the page</>),
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute(request, ReturnsSchema);
};

export default page;
