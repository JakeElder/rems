import {
  Filter,
  PartialRealEstateQuery,
  ServerRealEstateQuery
} from "@rems/types";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import {
  AiRealEstateQuerySchema,
  FilterSchema,
  PartialAiRealEstateQuerySchema,
  PropertySchema
} from "@rems/schemas";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as Models from "@/models";
import getProperties from "../app/api/properties/resolve";

const txt = (node: React.ReactNode) => {
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

const parse = (rows: any) => rows.map((r: any) => FilterSchema.parse(r));

const enumProperties = async () => {
  const [
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  ] = await Promise.all([
    Models.IndoorFeature.findAll({ raw: true }).then(parse),
    Models.LotFeature.findAll({ raw: true }).then(parse),
    Models.OutdoorFeature.findAll({ raw: true }).then(parse),
    Models.ViewType.findAll({ raw: true }).then(parse),
    Models.PropertyType.findAll({ raw: true }).then(parse)
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
  const schema = zodToJsonSchema(PartialAiRealEstateQuerySchema);
  return {
    ...(schema as any).properties,
    ...(await enumProperties())
  };
};

export const generateSchema = async () => {
  const schema = zodToJsonSchema(PartialAiRealEstateQuerySchema);
  return {
    ...schema,
    properties: await getQueryProperties()
  };
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
    Models.IndoorFeature.findAll({ raw: true }).then(parse),
    Models.LotFeature.findAll({ raw: true }).then(parse),
    Models.OutdoorFeature.findAll({ raw: true }).then(parse),
    Models.ViewType.findAll({ raw: true }).then(parse),
    Models.PropertyType.findAll({ raw: true }).then(parse)
  ]);

  const minify = (arr: Filter[]) => {
    return arr.map((f) => {
      const { id, name, slug } = f;
      return { id, name, slug };
    });
  };

  const request: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo-16k",
    temperature: 1.6,
    messages: [
      {
        role: "user",
        content: txt(
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
        content: txt(
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

  const res = await openai.createChatCompletion(request);
  const function_call = res.data.choices[0].message!.function_call;
  return JSON.parse(function_call!.arguments!);
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

export const nlToQuery = async (query: ServerRealEstateQuery, nl: string) => {
  // const request: CreateChatCompletionRequest = {
  //   model: "gpt-3.5-turbo",
  //   temperature: 0.1,
  //   messages: [
  //     {
  //       role: "system",
  //       content: message(
  //         <>
  //           You are an assistant, responsible for taking a json formatted real
  //           estate query, then taking a users input and displaying new
  //           properties, based on their input. Make sure the next query is an
  //           UPDATE of the original query, and includes all previous filters, as
  //           well as new ones.
  //         </>
  //       )
  //     },
  //     {
  //       role: "system",
  //       content: message(
  //         <>
  //           These are some instructions on how to construct the resulting query;
  //           <ul>
  //             <li>
  //               If the user specifies a budget as a single, fixed number, set
  //               both the `min-price` and `max-price`. Use reasonable judgement
  //               as to what the range should be. 10% would be a good baseline.
  //             </li>
  //             <li>
  //               Set `availability` to "rent" if the user specifies a monthly
  //               budget
  //             </li>
  //             <li>
  //               Be aware that a user may issue commands like "Reset the query".
  //               In this event, you, the assistant should return an empty query.
  //             </li>
  //           </ul>
  //         </>
  //       )
  //     },
  //     {
  //       role: "system",
  //       content: message(
  //         <>
  //           You will receive 2 subsequent messages before receiving the users
  //           input. The first will be the JSON schema to which the query objects
  //           adhere to. The second will be the current query, which has been used
  //           to retrieve properties that are appropriate for the user. After
  //           these messages, you will received the users input. You should use
  //           that input to amend the current query accordingly.
  //         </>
  //       )
  //     },
  //     {
  //       role: "system",
  //       content: JSON.stringify(await generateSchema())
  //     },
  //     {
  //       role: "system",
  //       content: JSON.stringify(query)
  //     },
  //     {
  //       role: "user",
  //       content: nl
  //     }
  //   ],
  //   functions: [
  //     {
  //       name: "showQueryDifference",
  //       description:
  //         "Shows the difference between a query before and after user input",
  //       parameters: {
  //         type: "object",
  //         properties: {
  //           previousQuery: {
  //             type: "object",
  //             properties: await getQueryProperties(),
  //             description: "The query before the users input"
  //           },
  //           nextQuery: {
  //             type: "object",
  //             properties: await getQueryProperties(),
  //             description: "The query after it has been updated"
  //           },
  //           response: {
  //             type: "string",
  //             description:
  //               "A polite response to be communicated to the user once the query has been executed"
  //           }
  //         }
  //       }
  //     }
  //   ]
  // };

  const res = await getProperties({ ...query, limit: "true" });
  const properties = res.data.map((p) => {
    const { description, images, ...rest } = p;
    return rest;
  });
  const context = { properties };

  const request: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo-16k",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You are "Remi", an assitant responsible for assiting a user
              navigating the listings page of a real estate website.
            </p>
            <p>
              You are reponsible for taking the users input and completing one
              of the following tasks;
            </p>
            <h1>1. Amending the current search query</h1>
            <p>
              The user may issue commands so that they may see properties that
              are more relevant to them. This may include commands or statements
              like;
            </p>
            <ul>
              <li>Show me properties in Chiang Mai with 3 bedrooms</li>
              <li>Add the mountain view filter</li>
              <li>It has to be pet friendly</li>
              <li>I like to watch movies</li>
            </ul>
            <p>
              When you have identified the user is attempting to refine their
              search results by adjusting parameters, you must take the current
              query and provide a diff to update it.
            </p>
            <p>
              These are some instructions on how to construct the resulting
              query;
            </p>
            <ul>
              <li>
                Pay special attention to location, and set the search-origin if
                a location is specified.
              </li>
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
                IMPORTANT: Pay special attention to which properties should be
                removed and which should be added. IE, if a user is interested
                in an additional lotFeature, ensure that the current lotFeatures
                are not removed.
              </li>
            </ul>
            <h1>2. Responding to questions about the resulting properties</h1>
            <p>
              Once the use has been presented with properties, based on their
              query, they may ask questions about the listings, or a specific
              listing that they can see. This may include questions like;
            </p>
            <ul>
              <li>How far is $PROPERTY_X from $LANDMARK</li>
              <li>Do any of these properties have a pool?</li>
              <li>Which of these properties has the largest living area</li>
            </ul>
            <p>These are some instructions for generating your response;</p>
            <ul>
              <li>
                Be aware that the user may prefer a single answer. Ie, in the
                event a user asks "Which property has the biggest living area",
                or "Which property is the most expensive", they expect a single
                property answer
              </li>
              <li>
                Only include properties that you are certain match criteria. IE,
                if the user asks if any properties have a pool, it must include
                a pool in the 'indoorFeatures' or 'lotFeatures' array
              </li>
              <li>
                Make sure to include a response, explaining why you have
                suggested these properties.
              </li>
              <li>Do not include any Markdown or links in your response.</li>
            </ul>
            <h1>
              3. Showing users properties they want to see more details of
            </h1>
            <p>
              The user may request to see a property by title, or by id. These
              commands will start with a request like "Show Me". It's IMPORTANT
              that when a user asks to see a property, or more details about the
              property, they are shown the property.
            </p>
          </>
        )
      },
      {
        role: "system",
        content: txt(
          <>
            <p>
              You will receive 3 subsequent messages before receiving the users
              input.
            </p>
            <ul>
              <li>1: The JSON schema to which the query objects adhere to.</li>
              <li>2: The current query, which adheres to that schema</li>
              <li>3: The JSON schema to which properties adhere to</li>
              <li>
                4: The current context, which includes currently visible
                properties
              </li>
            </ul>
            <p>
              After these messages, the final message you will receive is the
              users input. You should use that input, then invoke the function
              that will best serve that question or command.
            </p>
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
        role: "system",
        content: JSON.stringify(zodToJsonSchema(PropertySchema))
      },
      {
        role: "system",
        content: JSON.stringify(context)
      },
      {
        role: "user",
        content: nl
      }
    ],
    functions: [
      {
        name: "u",
        description: txt(
          <>
            Updates the current query, showing the user new properties based on
            their latest input. It accepts two arguments, which properties to
            remove, and which to add.
          </>
        ),
        parameters: {
          type: "object",
          required: ["n"],
          properties: {
            definitions: {
              q: {
                type: "object",
                properties: await getQueryProperties()
              }
            },
            r: {
              $ref: "#/definitions/q",
              description: "The properties to be removed from the current query"
            },
            a: {
              $ref: "#/definitions/q",
              description: "The properties to be added to the current query"
            },
            n: {
              type: "boolean",
              description: txt(
                <>
                  Whether or not this is a completely *NEW search* IE, the user
                  may say "It has to have a pool". This is an amendment on the
                  current query, and therefore this value will be false. The
                  user may also say "show me 3 bedroom properties in Pattaya".
                  This is a NEW search and so this value should be set to true
                </>
              )
            }
            // response: {
            //   type: "string",
            //   description: txt(
            //     <>
            //       A polite response to be communicated to the user once the
            //       query has been executed
            //     </>
            //   )
            // }
          }
        }
      },
      {
        name: "answerSingle",
        description: txt(
          <>
            Answers a users question, in the event that they have asked a
            question that warrants returning a *SINGLE* property as the answer
          </>
        ),
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: txt(
                <>
                  The id of the property that best matches the users question.
                </>
              )
            },
            pertinentFields: {
              type: "array",
              items: { type: "string" },
              description: txt(
                <>
                  A list of the fields, taken from the property schema that were
                  important when deriving this response.
                </>
              )
            },
            response: {
              type: "string",
              description: txt(
                <>
                  A brief response but polite, explaining how you arrived at
                  this conclusion. Include some context.
                </>
              )
            }
          }
        }
      },
      {
        name: "answerMultiple",
        description: txt(
          <>
            Answers a users question when the user has asked a question that
            would warrant choosing *MULTIPLE* properties.
          </>
        ),
        parameters: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              items: { type: "number" },
              description: txt(
                <>
                  The ids of the properties that best match the users question.
                </>
              )
            },
            pertinentFields: {
              type: "array",
              items: { type: "string" },
              description: txt(
                <>
                  A list of the fields, taken from the property schema that were
                  important when deriving this response.
                </>
              )
            },
            response: {
              type: "string",
              description: txt(
                <>
                  A brief response but polite, explaining how you arrived at
                  this conclusion. Include some context.
                </>
              )
            }
          }
        }
      },
      {
        name: "showProperty",
        description: txt(
          <>
            Shows the details of one of the properties the user is currently
            viewing
          </>
        ),
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: txt(
                <>The id of the properties the user wishes to see</>
              )
            },
            response: {
              type: "string",
              description: txt(
                <>
                  A brief response but polite, informing the user that their
                  request has been understood.
                </>
              )
            }
          }
        }
      }
    ]
  };

  try {
    const res = await openai.createChatCompletion(request);
    const message = res.data.choices[0].message!;

    console.dir(message, { depth: null, colors: true });

    return {};
  } catch (e: any) {
    console.dir(e.response.data, { depth: null, colors: true });
  }
};

// {false && (
//   <li>
//     IMPORTANT: Make sure you provide a JavaScript Object Notation
//     (JSON) Patch, RFC 6902 that describes how to transition from
//     the previous query, to the updated query. IE, it must describe
//     how to PATCH the current query, using a format like this;
//     {JSON.stringify([
//       { op: "replace", path: "/baz", value: "boo" },
//       { op: "add", path: "/hello", value: ["world"] },
//       { op: "remove", path: "/foo" }
//     ])}
//     MAKE SURE THE `queryPatch` ARGUMENT USES THIS NOTATION, EVERY
//     TIME
//   </li>
// )}

export const getModels = async () => openai.listModels();
