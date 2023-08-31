import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  stringify
} from "@/remi";
import { AiRefinement } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const { ArgsSchema, ReturnsSchema, ContextSchema } = AiRefinement.PageAndSort;

type Args = z.infer<typeof ArgsSchema>;
type Context = z.infer<typeof ContextSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const pageAndSort: Fn = async (input, current) => {
  const context = stringify<Context>({ input, current });
  const schema = stringify(zodToJsonSchema(ContextSchema));

  const request: ChatCompletionRequest = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You an assistant responsible for helping the user of a real estate
              website. Process their input and update the current page and sort.
            </p>
            <p>Useful context: `{context}`</p>
            <p>The context schema: `{schema}`</p>
            <p>
              Be minimal with output. There may be irrelevant content in the
              users input. Disregard this. Leave unnecessary values undefined
            </p>
          </>
        )
      }
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        description: txt(
          <>Updates the page and sort based on the users input.</>
        ),
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute(request, ReturnsSchema);
};

export default pageAndSort;
