import { ChatCompletionRequest, RemiResponse, txt, execute } from "@/remi";
import { AiRefinement } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import RefineCaveats from "../components/RefineCaveats";

const { ArgsSchema, ReturnsSchema } = AiRefinement.Location;

type Args = z.infer<typeof ArgsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const location: Fn = async (nl) => {
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
            <RefineCaveats>
              <li>
                It may be possible that the user has not specified the location.
                In this eventuality, it is fine to leave the relevant value null
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
        description: txt(<>Updates the location based on the users input.</>),
        parameters: zodToJsonSchema(AiRefinement.Location.ReturnsSchema)
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

export default location;
