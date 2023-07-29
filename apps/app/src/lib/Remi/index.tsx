import {
  Filter,
  PartialAiRealEstateQuery,
  PartialRealEstateQuery,
  Property
} from "@rems/types";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import api from "../../api";
import { AiRealEstateQuerySchema, PropertySchema } from "@rems/schemas";
import { zodToJsonSchema } from "zod-to-json-schema";

const message = (node: React.ReactNode) => {
  const { renderToStaticMarkup } = require("react-dom/server");
  return NodeHtmlMarkdown.translate(renderToStaticMarkup(node));
};

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

const enumArray = (key: keyof PartialRealEstateQuery, filters: Filter[]) => ({
  [key]: {
    type: "array",
    items: {
      type: "string",
      enum: filters.map((i) => i.slug)
    },
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
    ...enumArray("indoor-features", indoorFeatures),
    ...enumArray("lot-features", lotFeatures),
    ...enumArray("outdoor-features", outdoorFeatures),
    ...enumArray("property-type", propertyTypes),
    ...enumArray("view-types", viewTypes)
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

const execute = async <T extends any = any>(
  req: CreateChatCompletionRequest
): Promise<T> => {
  const res = await openai.createChatCompletion(req);
  const function_call = res.data.choices[0].message!.function_call;
  return JSON.parse(function_call!.arguments!);
};

export const createMockProperty = async () => {
  const schema = zodToJsonSchema(PropertySchema);

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

  const minify = (arr: Filter[]) => {
    return arr.map((f) => {
      const { id, name, slug } = f;
      return { id, name, slug };
    });
  };

  const request: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    temperature: 1.6,
    messages: [
      {
        role: "user",
        content: message(
          <>
            You are an assistant, responsible for inserting mock data in to a
            property website for demonstration purposes.
            <ul>
              <li>
                The property will be in Thailand. It is likely it will be in a
                more populated area, but may be in rural Thailand. There's a 5%
                chance it will be in Koh Samui and a 5% chance it will be in
                Phuket. There's a 20% chance the property will be in Chiang Mai.
              </li>
              <li>
                The property is likely to be a standard, affordable property, in
                the city but may be luxurious too.
              </li>
              <li>
                The property may be urban style, it may be in a remote hill
                village, on a beach, or a rural/jungle village property. It may
                also be an industrial/office type building. It could be a condo
                in a skyscraper in Bangkok
              </li>
              <li>Use a uuid as the `uid`, as it has to be unique</li>
              <li>
                Ensure the title is attention grabbing, descriptive and
                creative. Make it quite random. There's a 20% chance it should
                include the Town/City name the property is in.
              </li>
              <li>Make sure the lat/lng values are on land</li>
              <li>Make sure an address is included</li>
              <li>Make sure the latitude is between -90 and 90</li>
            </ul>
            This is the JSON schema;
          </>
        )
      },
      {
        role: "user",
        content: JSON.stringify(zodToJsonSchema(PropertySchema))
      },
      {
        role: "user",
        content: message(
          <>
            Here are the values that can be used for certain arrays. For
            indoorFeatures, lotFeatures, outdoorFeatures and viewTypes - please
            just set to be an array of ids. Do not include the objects with name
            and slug, only the id.
          </>
        )
      },
      {
        role: "user",
        content: JSON.stringify({ indoorFeatures: minify(indoorFeatures) })
      },
      {
        role: "user",
        content: JSON.stringify({ lotFeatures: minify(lotFeatures) })
      },
      {
        role: "user",
        content: JSON.stringify({ outdoorFeatures: minify(outdoorFeatures) })
      },
      {
        role: "user",
        content: JSON.stringify({ viewTypes: minify(viewTypes) })
      },
      {
        role: "user",
        content: JSON.stringify({ propertyType: minify(propertyTypes) })
      }
    ],
    functions: [
      {
        name: "insertMockProperty",
        description: "Inserts a mock properties for testing purposes",
        parameters: schema
      }
    ]
  };

  return execute<Property>(request);
};

export const createImages = async (prompt: string, n: number) => {
  const image = await openai.createImage({
    size: "1024x1024",
    prompt,
    response_format: "b64_json",
    n
  });

  const isString = (s: any): s is string => !!s;
  return image.data.data.map((i) => i.b64_json).filter(isString);
};

export const nlToQuery = async (query: PartialRealEstateQuery, nl: string) => {
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

  const res = await execute<{
    previousQuery: PartialAiRealEstateQuery;
    nextQuery: PartialAiRealEstateQuery;
    description: string;
  }>(request);

  return res.nextQuery;
};

export const getModels = async () => openai.listModels();
