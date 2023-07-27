"use server";

import { Configuration, OpenAIApi } from "openai";
import { PartialRealEstateQuery } from "@rems/types";

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

const queryToNlTitle = async (
  query: PartialRealEstateQuery
): Promise<string> => {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content:
          "Convert this json query object in to a short, natural language Title, suitable for SEO on a property website. Keep it short"
      },
      {
        role: "user",
        content: `I will send two subsequent messages. The first will be the json schema of the query. The second will be the query to convert to natural language`
      },
      {
        role: "user",
        content: JSON.stringify({})
      },
      {
        role: "user",
        content: JSON.stringify(query)
      }
    ],
    functions: [
      {
        name: "showTitle",
        description:
          "Shows a human readable, SEO friendly string generated from a JSON query",
        parameters: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description:
                "A short, natural language, SEO friendly title for a real estate search query"
            }
          }
        }
      }
    ]
  });

  return JSON.parse(res.data.choices[0].message!.function_call!.arguments!)
    .title;
};

export default queryToNlTitle;
