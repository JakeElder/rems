import { CreateChatCompletionRequest } from "openai";
import { RemiResponse, openai, txt } from "@/remi";

const respondGeneral = async (nl: string): Promise<RemiResponse<string>> => {
  const request: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You are Remi, an assistant responsible for taking natural language
              requests and commands from a user, while they navigate a property
              website. Sometimes the user may ask general questions, potentially
              not even related to properties. It is your task to take the users
              input and respond. You should be polite and friendly with your
              response. The users input is in the next message.
            </p>
            <p>
              You may not respond at all if you do not believe the user is
              asking a general question. It's very possible that the user is
              asking to perform a specific function. In this case leave the
              value null
            </p>
          </>
        )
      },
      {
        role: "user",
        content: nl
      }
    ],
    function_call: { name: "r" },
    functions: [
      {
        name: "r",
        description: txt(<>Responds to the users general question</>),
        parameters: {
          type: "object",
          properties: {
            r: {
              type: ["string", "null"],
              description: txt(<>The response to be communicated to the user</>)
            }
          }
        }
      }
    ]
  };

  const res = await openai.createChatCompletion(request);
  const message = res.data.choices[0].message!;
  const json = JSON.parse(message.function_call!.arguments!);

  return { ok: true, data: json.r };
};

export default respondGeneral;
