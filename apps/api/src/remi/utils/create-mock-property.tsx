import { zodToJsonSchema } from "zod-to-json-schema";
import { FilterSchema, PropertySchema } from "@rems/schemas";
import * as Models from "@/models";
import { ChatCompletionRequest, openai, txt } from "@/remi";
import { Filter } from "@rems/types";

const parse = (rows: any) => rows.map((r: any) => FilterSchema.parse(r));

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

  const request: ChatCompletionRequest = {
    model: "gpt-3.5-turbo-16k-0613",
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
