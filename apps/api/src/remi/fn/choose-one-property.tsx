import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, timelineToCompletionMessages } from "@/remi/utils";
import { PropertySchema, TimelineSchema } from "@rems/schemas";
import { z } from "zod";
import md from "@rems/utils/md";

const PropsSchema = z.object({
  timeline: TimelineSchema,
  properties: z.array(PropertySchema)
});

const ReturnsSchema = z
  .object({
    id: PropertySchema.shape["id"].describe(
      md(<>The id of the property, or null if no choice is made</>)
    ),
    j: z
      .string()
      .describe(md(<>The justification for this decision. A short sentence.</>))
  })
  .transform(({ id, j }) => ({ id, justification: j }));

type Props = z.infer<typeof PropsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;

const chooseOneProperty = async ({
  timeline,
  properties
}: Props): Promise<RemiResponse<Returns>> => {
  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You are Remi, a terse, cute, witty, female, Thai born, bi-lingual
            (Thai, English) assistant responsible for helping the user of a real
            estate website.
          </p>
          <p>
            Here are the currently visible properties:{" "}
            {JSON.stringify(
              properties.map(({ description, ...rest }) => ({
                ...rest
              }))
            )}
          </p>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default chooseOneProperty;
