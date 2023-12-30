import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, stringify, timelineToCompletionMessages } from "@/remi/utils";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  BudgetAndAvailabilityRequirementsSchema,
  TimelineSchema
} from "@rems/schemas";
import { Z } from "@rems/types";

const PropsSchema = z.object({
  timeline: TimelineSchema,
  current: BudgetAndAvailabilityRequirementsSchema
});

const ContextSchema = z.object({
  current: BudgetAndAvailabilityRequirementsSchema
});

const ReturnsSchema = z
  .object({
    mn: z.number(),
    mx: z.number(),
    t: z.enum(["SALE", "RENT"])
  })
  .partial()
  .transform(({ mn, mx, t }) => ({
    minPrice: mn,
    maxPrice: mx,
    type: t
  }));

type Props = Z<typeof PropsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;

const budgetAndAvailability = async ({
  timeline,
  current
}: Props): Promise<RemiResponse<Returns>> => {
  const context = stringify<Context>({ current });
  const schema = stringify(zodToJsonSchema(ContextSchema));

  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You an assistant responsible for helping the user of a real estate
            website. Process their input and update the current query to reflect
            their budget & availability requirements
          </p>
          <p>Useful context: `{context}`</p>
          <p>The context schema: `{schema}`</p>
          <ul>
            <li>
              If the user sets a monthly range, assume they are looking to rent
            </li>
            <li>Leave unchanged values undefined</li>
          </ul>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default budgetAndAvailability;
