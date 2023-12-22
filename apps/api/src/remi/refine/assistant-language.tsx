import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, timelineToCompletionMessages } from "@/remi/utils";
import { AssistantLanguageSchema, TimelineSchema } from "@rems/schemas";
import { Z } from "@rems/types";
import { z } from "zod";

export const PropsSchema = z.object({
  timeline: TimelineSchema
});

export const ReturnsSchema = z
  .object({ p: AssistantLanguageSchema })
  .transform(({ p }) => p);

type Props = Z<typeof PropsSchema>;
type Returns = Z<typeof ReturnsSchema>;

const assistantLanguage = async ({
  timeline
}: Props): Promise<RemiResponse<Returns>> => {
  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You an assistant responsible for helping the user of a real estate
            website. Process their input and change the assistant language.
          </p>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default assistantLanguage;
