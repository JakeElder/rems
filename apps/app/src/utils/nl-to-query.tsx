import { PartialRealEstateQuery } from "@rems/types";
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import api from "../api";
import { zodToJsonSchema } from "zod-to-json-schema";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { AiRealEstateQuerySchema } from "@rems/schemas/src/real-estate-query";

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

const message = (node: React.ReactNode) => {
  const { renderToStaticMarkup } = require("react-dom/server");
  return NodeHtmlMarkdown.translate(renderToStaticMarkup(node));
};

const enumArray = (key: keyof PartialRealEstateQuery, values: string[]) => ({
  [key]: {
    type: "array",
    items: { type: "string", enum: values },
    default: []
  }
});

const enumProperties = async () => {
  const [
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  ] = await Promise.all([
    api.get.indoorFeatures(),
    api.get.lotFeatures(),
    api.get.outdoorFeatures(),
    api.get.viewTypes(),
    api.get.propertyTypes()
  ]);

  return {
    ...enumArray(
      "indoor-features",
      indoorFeatures.map((i) => i.slug)
    ),
    ...enumArray(
      "lot-features",
      lotFeatures.map((i) => i.slug)
    ),
    ...enumArray(
      "outdoor-features",
      outdoorFeatures.map((i) => i.slug)
    ),
    ...enumArray(
      "property-type",
      propertyTypes.map((i) => i.slug)
    ),
    ...enumArray(
      "view-types",
      viewTypes.map((i) => i.slug)
    )
  };
};

const getQueryProperties = async () => {
  const schema = zodToJsonSchema(AiRealEstateQuerySchema);
  return {
    ...(schema as any).properties,
    ...(await enumProperties())
  };
};

const generateSchema = async () => {
  const schema = zodToJsonSchema(AiRealEstateQuerySchema);
  return {
    ...schema,
    properties: await getQueryProperties()
  };
};

export default async function nlToQuery(
  query: PartialRealEstateQuery,
  nl: string
): Promise<PartialRealEstateQuery | undefined> {
  const request: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: message(
          <>
            You are an assistant, responsible for taking a json formatted real
            estate query, then taking a users input and displaying new
            properties, based on their input. Make sure the next query is an
            UPDATE of the original query, and includes all previous filters, as
            well as new ones.
          </>
        )
      },
      {
        role: "system",
        content: message(
          <>
            These are some instructions on how to construct the resulting query;
            <ul>
              <li>
                If the user specifies a budget as a single, fixed number, set
                both the `min-price` and `max-price`. Use reasonable judgement
                as to what the range should be. 10% would be a good baseline.
              </li>
              <li>
                Set `availability` to "rent" if the user specifies a monthly
                budget
              </li>
              <li>
                Be aware that a user may issue commands like "Reset the query".
                In this event, you, the assistant should return an empty query.
              </li>
            </ul>
          </>
        )
      },
      {
        role: "system",
        content: message(
          <>
            You will receive 2 subsequent messages before receiving the users
            input. The first will be the JSON schema to which the query objects
            adhere to. The second will be the current query, which has been used
            to retrieve properties that are appropriate for the user. After
            these messages, you will received the users input. You should use
            that input to amend the current query accordingly.
          </>
        )
      },
      {
        role: "system",
        content: JSON.stringify(await generateSchema())
      },
      {
        role: "system",
        content: JSON.stringify(query)
      },
      {
        role: "user",
        content: nl
      }
    ],
    functions: [
      {
        name: "showQueryDifference",
        description:
          "Shows the difference between a query before and after user input",
        parameters: {
          type: "object",
          properties: {
            previousQuery: {
              type: "object",
              properties: await getQueryProperties(),
              description: "The query before the users input"
            },
            nextQuery: {
              type: "object",
              properties: await getQueryProperties(),
              description: "The query after it has been updated"
            },
            description: {
              type: "string",
              description: "An explanation as to how the query has changed"
            }
          }
        }
      }
    ]
  };

  try {
    const res = await openai.createChatCompletion(request);
    const choice = res.data.choices[0];
    const message = choice.message!;
    const function_call = message.function_call!;
    return JSON.parse(function_call.arguments!);
  } catch (e) {
    console.error("Error with call");
  }
}

//   const messages: ChatCompletionRequestMessage[] = [
//     {
//       role: "user",
//       content: `
//         Update this query based on the following user input: "${nl}".
//         Current query: \`${JSON.stringify(query)}\`.
//         Make sure to update the current query, don't create a new one.
//         JSON Schema: \`${JSON.stringify(
//           await generateRealEstateQuerySchema()
//         )}\`
//       `
//     }
//   ];
