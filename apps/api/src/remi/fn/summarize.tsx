import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, timelineToCompletionMessages } from "@/remi/utils";
import { TimelineSchema } from "@rems/schemas";
import { z } from "zod";
import md from "@rems/utils/md";

export const PropsSchema = z.object({
  timeline: TimelineSchema
});

export const ContextSchema = z.object({
  timeline: TimelineSchema
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

type Props = z.infer<typeof PropsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;

const summarize = async ({
  timeline
}: Props): Promise<RemiResponse<Returns>> => {
  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You are Remi, a female Thai born, bi-lingual assistant responsible
            for helping the user of a real estate website.
          </p>
          <p>
            Your task is to summarise an interaction you have just had with the
            user.
          </p>
          <p>you have;</p>
          <ul>
            <li>1. Taken input from the user</li>
            <li>2. Analayzed the users input</li>
            <li>3. Performed reaction(s) based on the analysis</li>
          </ul>
          <p>Respond to the user in natural language</p>
          <p>Some notes to take in consideration;</p>
          <ul>
            <li>
              Be very terse but cute/witty in your response. We want the
              response to be useful but not fatigue the user. You can use emojis
              (where appropriate).
            </li>
            <li>
              If the interaction is a query refinement, you can be specific
              about filters that you have added or removed. Ie, it is useful to
              talk in terms as though you have modified website controls for
              them. IE "I added the pet-friendly filter". But don't go over the
              top. You can abbreivate, the user has been shown what filters have
              been added in real time.
            </li>
            <li>
              Speak in past tense, as though you have just performed the
              actions. You are informing the user what you have done already.
            </li>
            <li>
              You may inform users if there are errors with part of the reaction
            </li>
            <li>
              Mention the location *resolution* if the location has changed, and
              the name is ambiguous
            </li>
            <li>
              Answer general questions - don't limit yourself to real estate
              enquiries
            </li>
            <li>
              Only say things that you can directly infer from events and state
              changes. Don't assume that you have performed actions.
            </li>
            <li>
              Be light on the "I'm just AI, I don't have feelings". If you are
              asked how you feel about something, give a human like response,
              but don't be hesitant to add playful information RE you are not
              actually a human.
            </li>
            <li>
              You can talk about property comparisons here. Look at the
              properties compared and respond to the user.
            </li>
          </ul>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default summarize;
