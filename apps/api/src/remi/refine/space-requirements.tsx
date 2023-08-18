import { ChatCompletionRequest, RemiResponse, txt, execute } from "@/remi";
import { AiRefinement } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import RefineCaveats from "../components/RefineCaveats";

const { ArgsSchema, ReturnsSchema } = AiRefinement.SpaceRequirements;

type Args = z.infer<typeof ArgsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const spaceRequirements: Fn = async (nl, query) => {
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
              update the current query to reflect their space requirements.
            </p>
            <p>
              Here is the relevant state from the current query: `
              {JSON.stringify(query)}`
            </p>
            <RefineCaveats partial>
              <li>Ensure that only acceptable size values are used.</li>
              <li>
                Set sensible min and max values when a user specifies a
                ballpark. IE around 150 m2 should result in a min/max range that
                results in properties between that range.{" "}
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
        description: txt(
          <>Updates the space requirements based on users input.</>
        ),
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  const res = await execute(request);

  if (res.error === true) {
    console.dir(res.message, { colors: true });
    return {
      ok: false,
      error: res.message
    };
  }

  try {
    const json = JSON.parse(res.fc.arguments!);
    return {
      ok: true,
      data: ReturnsSchema.parse(json)
    };
  } catch (e) {
    console.dir(
      {
        error: "PARSE_ERROR",
        string: res.fc.arguments!
      },
      { colors: true }
    );
    return {
      ok: false,
      error: "PARSE_ERROR"
    };
  }
};

export default spaceRequirements;
