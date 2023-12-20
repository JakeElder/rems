import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, stringify, timelineToCompletionMessages } from "@/remi/utils";
import {
  RealEstateIndexPageAndSortSchema,
  TimelineSchema
} from "@rems/schemas";
import { Z } from "@rems/types";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const Sort = RealEstateIndexPageAndSortSchema.shape["sort"];

export const ContextSchema = z.object({
  current: Sort
});

export const PropsSchema = z.object({
  timeline: TimelineSchema,
  current: Sort
});

export const ReturnsSchema = z
  .object({ s: Sort })
  .partial()
  .transform(({ s }) => s);

type Props = Z<typeof PropsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;

const pageAndSort = async ({
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
            website. Process their input and update the current sort order.
          </p>
          <p>Useful context: `{context}`</p>
          <p>The context schema: `{schema}`</p>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default pageAndSort;
