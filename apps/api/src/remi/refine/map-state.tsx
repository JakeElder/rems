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

const { ArgsSchema, ReturnsSchema, ContextSchema } = AiRefinement.MapState;

type Args = z.infer<typeof ArgsSchema>;
type Context = z.infer<typeof ContextSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const mapState: Fn = async (input, current) => {
  const context = stringify<Context>({ input, current });
  const schema = stringify(zodToJsonSchema(ContextSchema));

  const request: ChatCompletionRequest = {
    model: "davinci",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You an assistant responsible for helping the user of a real estate
              website. Process their input and update the current query to
              reflect the listings map
            </p>
            <p>Useful context: `{context}`</p>
            <p>The context schema: `{schema}`</p>
            <ul>
              <li>Leave unchanged values undefined</li>
              <li>
                Do not set lng/lat based on location. Only set the lng/lat when
                the user has made a relative adjustment. IE, "shift north a
                bit". Do *not* resolve locations to lng/lat.
              </li>
              <li>
                Only set values when the user has been explicit in their
                request. Ie "zoom in". "Shift north a bit"
              </li>
            </ul>
          </>
        )
      }
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        description: txt(<>Updates the map state</>),
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute(request, ReturnsSchema);
};

export default mapState;
