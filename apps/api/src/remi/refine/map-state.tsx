import { ChatCompletionRequest, RemiResponse, txt, execute } from "@/remi";
import { AiRefinement } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import RefineCaveats from "../components/RefineCaveats";

const { ArgsSchema, ReturnsSchema } = AiRefinement.MapState;

type Args = z.infer<typeof ArgsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const mapState: Fn = async (nl, query) => {
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
              update the map state based on their command.
            </p>
            <p>
              Here is the relevant state from the current query: `
              {JSON.stringify(query)}`
            </p>
            <p>
              You should use these values when the user specifies a delta. IE
              "increase the radius", or "move the map up a bit" or "zoom out a
              bit"
            </p>
            <p>Some points to take in to consideration;</p>
            <RefineCaveats partial>
              <li>
                Do *NOT* set the lng/lat based on a location. Only specify a new
                lng/lat if the command has a relative adjustment. IE "Shift
                north a bit".
              </li>
            </RefineCaveats>
          </>
        )
      },
      {
        role: "user",
        content: nl
      }
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        description: txt(<>Updates the map state based on the users input.</>),
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  const res = await execute(request);

  if (res.error === true) {
    return {
      ok: false,
      error: res.error
    };
  }

  const json = JSON.parse(res.fc.arguments!);

  return {
    ok: true,
    data: ReturnsSchema.parse(json)
  };
};

export default mapState;
