import { Command } from "commander";
import { propertySchema } from "@rems/types";
import zodToJsonSchema from "zod-to-json-schema";
import { Configuration, OpenAIApi } from "openai";
// import api from "../api";
import nlToQuery, { generateRealEstateQuerySchema } from "../utils/nl-to-query";
const KEY = "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";

const openai = new OpenAIApi(new Configuration({ apiKey: KEY }));

const generateSchema = async () => {
  const schema = zodToJsonSchema(propertySchema);
  return schema;
  // return {
  //   type: "object",
  //   properties: {
  //     mockProperties: {
  //       type: "array",
  //       items: {
  //         type: "object",
  //         items: schema
  //       }
  //     }
  //   }
  // };
};

const previous =
  '{"indoor-features":[],"lot-features":["modern"],"outdoor-features":[],"property-type":["house","villa","estate","country-house","chalet","townhouse","bungalow","apartment","penthouse","condo"],"view-types":["panoramic-scenic-view"],"page":1,"sort":"newest-first","min-price":0,"max-price":null,"min-bedrooms":2,"max-bedrooms":null,"min-bathrooms":0,"min-living-area":0,"max-living-area":null,"nearest-mrt-station":null,"nearest-bts-station":null,"area":null,"availability":"sale","min-lot-size":0,"max-lot-size":null}';
const current =
  '{"indoor-features":[],"lot-features":["modern"],"outdoor-features":[],"property-type":["house","villa","estate","country-house","chalet","townhouse","bungalow","apartment","penthouse","condo"],"view-types":["panoramic-scenic-view"],"page":1,"sort":"newest-first","min-price":0,"max-price":null,"min-bedrooms":4,"max-bedrooms":null,"min-bathrooms":0,"min-living-area":0,"max-living-area":null,"nearest-mrt-station":null,"nearest-bts-station":null,"area":null,"availability":"sale","min-lot-size":0,"max-lot-size":null}';

const diffToNl = async () => {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 1.5,
    messages: [
      {
        role: "user",
        content:
          "Convert the diff of these JSON objects in to a short, natural language summary"
      },
      {
        role: "user",
        content: `I will send three subsequent messages. The first will be the json schema of the queries. The second will be the state of the query before an interaction. The third will be the state of the query after a user interaction.`
      },
      {
        role: "user",
        content: JSON.stringify(await generateRealEstateQuerySchema())
      },
      {
        role: "user",
        content: previous
      },
      {
        role: "user",
        content: current
      }
    ],
    functions: [
      {
        name: "showQueryDiffSummary",
        description: "Shows a natural language diff of two queries",
        parameters: {
          type: "object",
          properties: {
            summary: {
              type: "string",
              description:
                "A short, natural language summary, describing the change between two queries"
            }
          }
        }
      }
    ]
  });

  return JSON.parse(res.data.choices[0].message!.function_call!.arguments!);
};

const generateProperty = async () => {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 1.5,
    messages: [
      {
        role: "user",
        content: "Insert a mock property for a real estate website"
      },
      {
        role: "user",
        content: "Make sure the property is located in Bangkok"
      }
    ],
    functions: [
      {
        name: "insertMockProperty",
        description: "Inserts a mock properties for testing purposes",
        parameters: await generateSchema()
      }
    ]
  });

  return JSON.parse(res.data.choices[0].message!.function_call!.arguments!);
};

const queryToNlTitle = async () => {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 1.5,
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
        content: JSON.stringify(await generateRealEstateQuerySchema())
      },
      {
        role: "user",
        content: current
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

  return JSON.parse(res.data.choices[0].message!.function_call!.arguments!);
};

const program = new Command();

program.name("rems-cli").description("Rems CLI tools");

program
  .command("insert-mock-property")
  .description("Inserts a mock property to the database")
  .action(async () => {
    const property = await generateProperty();
    console.dir(property, { depth: null });
  });

program
  .command("nl-to-query")
  .description("Converts natural language to a property query")
  .argument("<string>", "The nl query to convert")
  .action(async (q: string) => {
    const res = await nlToQuery(q);
    console.dir(res);
  });

program
  .command("diff-to-nl")
  .description("Converts a query diff in to natural language")
  .action(async () => {
    const res = await diffToNl();
    console.dir(res);
  });

program
  .command("query-to-nl-title")
  .description("Converts a query in to an SEO friendly title")
  .action(async () => {
    const res = await queryToNlTitle();
    console.dir(res);
  });

program
  .command("gpt-models")
  .description("Lists gpt models")
  .action(async () => {
    const models = await openai.listModels();
    console.dir(
      models.data.data.map((m) => m.id),
      { depth: null, colors: true }
    );
  });

program.parse();
