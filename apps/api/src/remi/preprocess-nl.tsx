import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import { txt } from "./utils";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

const instructions: (nl: string) => CreateChatCompletionRequest["messages"] = (
  nl
) => {
  return [
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
  ];
};

const PropertiesSchema = z.object({
  t: z.enum(["NQ", "RQ", "OP", "RB"]).describe(
    txt(
      <>
        <p>
          The type of action that should be performed based on the users natural
          language input. The value should be one of the following;
        </p>
        <ul>
          <li>
            `NQ` (new query): The user has issued a command that implies they
            would wish to begin a new search. EG "Show me properties in
            (location)"
          </li>
          <li>
            `RQ` (refine query): The user has issued a command that implies they
            would like to continue exploring the current set of properties, but
            with additional or amended search critera. EG "It has to have a bar"
          </li>
          <li>
            `OP` (open property): The user has issued a command that implies
            they have identified a property in and they would like to see more
            details. EG "Show me $NL_THAT_SOUNDS_LIKE_A_PROPERTY_DESCRIPTION".
            They may request to see details by number, or by the properties
            title.
          </li>
          <li>
            `RV` (request viewing): The user has identified a property they
            would like to see, and would like to book a viewing. EG "Ok, book a
            viewing"
          </li>
        </ul>
      </>
    )
  )
});

export const preprocessNl = async (nl: string) => {
  const request: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo-0613",
    messages: instructions(nl),
    functions: [
      {
        name: "p",
        description: txt(
          <>
            further processes a users request based on the nature of their
            input.
          </>
        ),
        parameters: zodToJsonSchema(PropertiesSchema)
      },
      {
        name: "err",
        description: txt(
          <>
            Produces an error. This should be invoked when the users command can
            not be understood.
          </>
        ),
        parameters: zodToJsonSchema(
          z.object({
            m: z
              .string()
              .describe(
                txt(
                  <>
                    The error message, explaining to the user why we are unable
                    to process their command, and how they may increase their
                    chance of being understood when they make another attempt.
                  </>
                )
              )
          })
        )
      }
    ]
  };

  try {
    const res = await openai.createChatCompletion(request);
    const message = res.data.choices[0].message!;
    return message.function_call!;
  } catch (e: any) {
    console.dir(e.response.data, { depth: null, colors: true });
    return {};
  }
};
