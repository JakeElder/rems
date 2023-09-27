import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  stringify
} from "@/remi";
import { AiRefinement } from "@rems/schemas";
import { zodToJsonSchema } from "zod-to-json-schema";
import RefineCaveats from "../components/RefineCaveats";
import { Z } from "@rems/types";

const { ArgsSchema, ReturnsSchema, ContextSchema } = AiRefinement.Location;

type Args = Z<typeof ArgsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Returns>>;

const location: Fn = async (context: Context) => {
  const schema = stringify(zodToJsonSchema(ContextSchema));
  const request: ChatCompletionRequest = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You are Remi, an assistant responsible for helping the user of a
              real estate website. Your task is to process their input and
              identify the "search origin" within their query.
            </p>
            <p>Here is context: `{stringify<Context>(context)}`</p>
            <p>This is schema context: `{schema}`</p>
          </>
        )
      }
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        parameters: zodToJsonSchema(AiRefinement.Location.ReturnsSchema)
      }
    ]
  };

  return execute(request, ReturnsSchema);
};

export default location;
