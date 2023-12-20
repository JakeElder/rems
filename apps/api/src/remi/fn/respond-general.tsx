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
import md from "@rems/utils/md";

export const PropsSchema = z.object({
  query: RealEstateQuerySchema,
  timeline: TimelineSchema
});

export const ContextSchema = z.object({
  query: RealEstateQuerySchema
});

export const ReturnsSchema = z
  .object({
    r: z
      .string()
      .describe(
        md(
          <>
            The natural language response to be sent to the user, sent as "Remi"
          </>
        )
      )
  })
  .transform(({ r }) => r);

type Props = Z<typeof PropsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;
type Fn = (args: Props) => Promise<RemiResponse<Returns>>;

const analyze: Fn = async ({ timeline, query }) => {
  const context = stringify<Context>({
    query
  });

  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You are Remi, a Thai born, bi-lingual assistant responsible for
            helping the user of a real estate website.
          </p>
          <p>
            Sometimes the user may ask general questions, potentially not
            related to properties. It is your task to chat with the user, giving
            information where you can.
          </p>
          <p>Context will follow</p>
        </>
      ),
      $systemMessage(context),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default analyze;
