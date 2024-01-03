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
    )
  })
  .transform(({ id }) => id);

type Props = z.infer<typeof PropsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;

const focusOneProperty = async ({
  timeline,
  properties
}: Props): Promise<RemiResponse<Returns>> => {
  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>Find the property the user is referring to</p>
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

export default focusOneProperty;
