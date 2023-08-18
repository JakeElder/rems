import { ChatCompletionRequest, RemiResponse, txt, execute } from "@/remi";
import { AiRefinement } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import RefineCaveats from "../components/RefineCaveats";

const { ArgsSchema, ReturnsSchema } = AiRefinement.BudgetAndAvailability;

type Args = z.infer<typeof ArgsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const budgetAndAvailability: Fn = async (nl, query) => {
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
              update the current query to reflect thier budget, and whether or
              not they are looking for a sale/rental property.
            </p>
            <p>
              Here is the relevant state from the current query: `
              {JSON.stringify(query)}`
            </p>
            <RefineCaveats partial>
              <li>
                Set sensible min and max values when a user specifies a
                ballpark. IE "around 30k" should set both min and max values.
                10% is a good ballpark.
              </li>
              <li>
                Try to extrapolate the availablity based on the users input. IE,
                if the user specifies a single figure that seemingly represents
                a purchase price, set the availability to `sale`.
              </li>
              <li>
                Use sensible judgment to identify the values. IE, sometimes the
                user will say "around 30" per month. This implies around 30,000.
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
          <>Updates the budget/availability based on users input.</>
        ),
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute(request, ReturnsSchema);
};

export default budgetAndAvailability;
