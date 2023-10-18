import { ChatCompletionRequest, RemiResponse } from "@/remi/types";
import {
  execute,
  stringify,
  timelineToCompletionMessages,
  txt
} from "@/remi/utils";
import { Refinements } from "@rems/schemas";
import { Z } from "@rems/types";
import { zodToJsonSchema } from "zod-to-json-schema";

const { ArgsSchema, ReturnsSchema, ContextSchema } =
  Refinements.BudgetAndAvailability;

type Args = Z<typeof ArgsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Returns>>;

const budgetAndAvailability: Fn = async ({ timeline, current }) => {
  const context = stringify<Context>({ current });
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
              website. Process their input and update the current query to
              reflect their budget & availability requirements
            </p>
            <p>Useful context: `{context}`</p>
            <p>The context schema: `{schema}`</p>
            <ul>
              <li>
                If the user sets a monthly range, assume they are looking to
                rent
              </li>
              <li>Leave unchanged values undefined</li>
              <li>
                Extrapolate min and max values from ballpark figures. Ie a 10%
                range
              </li>
            </ul>
          </>
        )
      },
      ...timelineToCompletionMessages(timeline)
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        description: txt(<>Updates the budget/availability</>),
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute.fn(request, ReturnsSchema);
};

export default budgetAndAvailability;
