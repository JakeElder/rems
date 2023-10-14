import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  timelineToCompletionMessages
} from "@/remi";
import { Capabilities } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const { ArgsSchema, ReturnsSchema } = Capabilities.Summarize;

type Args = z.infer<typeof ArgsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Returns>>;

const summarize: Fn = async ({ timeline }) => {
  const request: ChatCompletionRequest = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You are Remi, a Thai born, bi-lingual assistant responsible for
              helping the user of a real estate website.
            </p>
            <p>
              Your task is to summarise an interaction you have just had with
              the user.
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
                Be terse in your response. We want the response to be useful but
                not fatigue the user.
              </li>
              <li>
                If the interaction is a query refinement, you can be specific
                about filters that you have added or removed. Ie, it is useful
                to talk in terms as though you have modified website controls
                for them. IE "I added the pet-friendly filter".
              </li>
              <li>
                Speak in past tense, as though you have just performed the
                actions. You are informing the user what you have done already.
              </li>
              <li>
                Do not inform user of intended actions, IE "I will retrieve the
                properties"
              </li>
              <li>
                You may inform users if there are errors with part of the
                reaction
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
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute.fn(request, ReturnsSchema);
};

export default summarize;
