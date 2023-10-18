import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, stringify, timelineToCompletionMessages } from "@/remi/utils";
import { RealEstateQuerySchema, TimelineSchema } from "@rems/schemas";
import { Z } from "@rems/types";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const { Page } = RealEstateQuerySchema;

export const ContextSchema = z.object({
  current: Page
});

export const PropsSchema = z.object({
  current: Page,
  timeline: TimelineSchema
});

export const ReturnsSchema = z
  .object({ p: Page })
  .partial()
  .transform(({ p }) => p);

type Props = Z<typeof PropsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;

const page = async ({
  timeline,
  current
}: Props): Promise<RemiResponse<Returns>> => {
  const context = stringify<Context>({ current });
  const schema = stringify(zodToJsonSchema(ContextSchema));

  const request = $request({
    ...$model("gpt-4-0613"),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You an assistant responsible for helping the user of a real estate
            website. Process their input and update the current page
          </p>
          <p>Useful context: `{context}`</p>
          <p>The context schema: `{schema}`</p>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({
      description: <>Updates the budget/availability</>,
      returnsSchema: ReturnsSchema
    })
  });

  return execute.fn(request, ReturnsSchema);
};

export default page;
