import { Command } from "commander";
import { propertySchema } from "@rems/types";
import zodToJsonSchema from "zod-to-json-schema";
import { Configuration, OpenAIApi } from "openai";
// import api from "../api";
import nlToQuery from "../utils/nl-to-query";
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

const generateProperties = async (n: number) => {
  try {
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 2,
      messages: [
        {
          role: "user",
          content: `Generate mock data for 10 properties`
        }
        // {
        //   role: "user",
        //   content: `Include mock data for ${n} properties`
        // }
      ],
      functions: [
        {
          name: "insertMockProperty",
          description: "Inserts a mock property for testing purposes",
          parameters: await generateSchema()
        }
      ]
    });
    console.dir(res.data, { depth: null, colors: true });
  } catch (e) {
    console.log(e);
  }
  return {};
};

const program = new Command();

program.name("rems-cli").description("Rems CLI tools");

program
  .command("insert-mock-properties")
  .description("Inserts mock properties to the database")
  .argument("<number>", "the number of mock properties to add")
  .action(async (n: number) => {
    console.log(JSON.stringify(await generateProperties(1), null, 2));
    // console.log(
    //   JSON.stringify(
    //     await nlToQuery("3 bedroom apartments wiht a view"),
    //     null,
    //     2
    //   )
    // );
  });

program.parse();
