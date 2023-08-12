import { ServerRealEstateQuery } from "@rems/types";
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import { txt } from "./utils";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { generateSchema } from ".";
import { getQueryProperties } from "./generate-schema";

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

const instructions = async (
  query: ServerRealEstateQuery,
  nl: string
): Promise<CreateChatCompletionRequest["messages"]> => {
  return [
    {
      role: "system",
      content: txt(
        <>
          <p>
            You are Remi, an assistant responsible for helping the user of a
            real estate website. Your task is to; 1. Take a JSON formatted
            object describing the current search query. 2. Process a users
            command 3. Update the query.
          </p>
          <p>
            This is the schema for the query:`
            {JSON.stringify(await generateSchema())}`
          </p>
          <p>This is the current, active query: `{JSON.stringify(query)}`</p>
          <p>This is the users input: `{nl}`</p>
        </>
      )
    }
  ];
};

export const reviseQuery = async (query: ServerRealEstateQuery, nl: string) => {
  const request: CreateChatCompletionRequest = {
    // model: "gpt-4",
    model: "gpt-3.5-turbo-0613",
    messages: await instructions(query, nl),
    function_call: { name: "u" },
    functions: [
      {
        name: "u",
        description: txt(
          <>
            Updates the current query, showing the user new properties based on
            their latest input. It accepts two arguments, which properties to
            remove, and which to add. When the user ADDs Search criteria, IE,
            "It has to be at least 3 bedrooms", these properties will be added
            under the `add` parameter.
          </>
        ),
        parameters: {
          type: "object",
          properties: {
            definitions: {
              query: {
                type: "object",
                properties: await getQueryProperties()
              }
            },
            r: {
              $ref: "#/definitions/query",
              description: "The properties to be removed from the current query"
            },
            a: {
              $ref: "#/definitions/query",
              description: "The properties to be added to the current query"
            }
          }
        }
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
    console.dir(message, { depth: null, colors: true });
    return message.function_call!;
  } catch (e: any) {
    console.dir(e.response.data, { depth: null, colors: true });
    return {};
  }
};
