import { ChatCompletionRequest, RemiResponse, txt, execute } from "@/remi";
import { AiRefinement } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import RefineCaveats from "../components/RefineCaveats";

const { ArgsSchema, ReturnsSchema } = AiRefinement.PageAndSort;

type Args = z.infer<typeof ArgsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const pageAndSort: Fn = async (nl, query) => {
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
              update the current page and sort order of the property listings.
            </p>
            <p>
              Here is the relevant state from the current query: `
              {JSON.stringify(query)}`
            </p>
            <RefineCaveats partial>
              <li>
                We only need to change the page and sort when the user
                explicitly requests to change the page or sort. It is not
                necessary to set these values if the user has not mentioned them
                literally.
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
          <>Updates the page and sort based on the users input.</>
        ),
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

export default pageAndSort;
