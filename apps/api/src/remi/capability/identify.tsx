import {
  CapabilityCode,
  ChatCompletionRequest,
  RemiResponse,
  openai,
  txt
} from "@/remi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { CapabilitySchema } from "@rems/schemas";
import { capabilities } from "@/remi";

const identify = async (nl: string): Promise<RemiResponse<CapabilityCode>> => {
  const request: ChatCompletionRequest = {
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You are Remi, an assistant responsible for taking natural language
              requests and commands from a user while they navigate a property
              website.
            </p>
            <p>
              Your task, for now is to simply take the users input/command and
              identify which capability of yours is best suited to help the
              user.
            </p>
            <p>These are your capabilities;</p>
            <code>{JSON.stringify(capabilities)}</code>
            <p>This is the schema of a capability;</p>
            <code>{JSON.stringify(zodToJsonSchema(CapabilitySchema))}</code>
            <p>The next message is the users input.</p>
          </>
        )
      },
      {
        role: "user",
        content: nl
      }
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        description: txt(
          <>
            Sets the capability code for this users input, so that it may be
            further processed.
          </>
        ),
        parameters: {
          type: "object",
          properties: {
            c: {
              type: "string",
              enum: capabilities.map((c) => c.code)
            }
          }
        }
      }
    ]
  };

  const res = await openai.createChatCompletion(request);
  const message = res.data.choices[0].message!;
  const json = JSON.parse(message.function_call!.arguments!);

  return { ok: true, data: json.c };
};

export default identify;
