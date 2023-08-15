import { ChatCompletionRequest, RemiResponse, openai, txt } from "@/remi";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { CapabilitySchema } from "@rems/schemas";
import { Capability } from "@rems/types";

const identify = async (
  nl: string
): Promise<RemiResponse<Capability>> => {
  const request: ChatCompletionRequest = {
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            You are Remi, an assistant responsible for taking natural language
            requests and commands from a user, while they navigate a property
            website. You are responsible for simply taking their input and
            identifying the nature of their command so that it may be further
            processed. The following message is the users input.
          </>
        )
      },
      {
        role: "user",
        content: nl
      }
    ],
    function_call: { name: "p" },
    functions: [
      {
        name: "p",
        description: txt(
          <>
            further processes a users request based on the nature of their
            input.
          </>
        ),
        parameters: zodToJsonSchema(z.object({ t: CapabilitySchema }))
      }
    ]
  };

  const res = await openai.createChatCompletion(request);
  const message = res.data.choices[0].message!;
  const json = JSON.parse(message.function_call!.arguments!);

  return { ok: true, data: json.t };
};

export default identify;
