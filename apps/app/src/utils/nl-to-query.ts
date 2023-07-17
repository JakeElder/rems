import { PartialRealEstateQuery, realEstateQuerySchema } from "@rems/types";
import { Configuration, OpenAIApi } from "openai";
import api from "../api";
const KEY = "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";
import { zodToJsonSchema } from "zod-to-json-schema";

const configuration = new Configuration({ apiKey: KEY });
const openai = new OpenAIApi(configuration);

async function generateSchema() {
  const jsonSchema = zodToJsonSchema(realEstateQuerySchema);

  const [
    btsStations,
    indoorFeatures,
    lotFeatures,
    mrtStations,
    outdoorFeatures,
    viewTypes,
    propertyTypes,
    areas
  ] = await Promise.all([
    api.get.btsStations(),
    api.get.indoorFeatures(),
    api.get.lotFeatures(),
    api.get.mrtStations(),
    api.get.outdoorFeatures(),
    api.get.viewTypes(),
    api.get.propertyTypes(),
    api.get.areas()
  ]);

  const withEnums = {
    ...jsonSchema,
    properties: {
      ...(jsonSchema as any).properties,
      "indoor-features": {
        type: "array",
        items: {
          type: "string",
          enum: indoorFeatures.map((i) => i.slug)
        },
        default: []
      },
      "lot-features": {
        type: "array",
        items: {
          type: "string",
          enum: lotFeatures.map((i) => i.slug)
        },
        default: []
      },
      "outdoor-features": {
        type: "array",
        items: {
          type: "string",
          enum: outdoorFeatures.map((i) => i.slug)
        },
        default: []
      },
      "property-type": {
        type: "array",
        items: {
          type: "string",
          enum: propertyTypes.map((i) => i.slug)
        },
        default: []
      },
      "view-types": {
        type: "array",
        items: {
          type: "string",
          enum: viewTypes.map((i) => i.slug)
        },
        default: []
      },
      "nearest-bts-station": {
        type: ["string", "null"],
        enum: [...btsStations.map((i) => i.slug), null],
        default: null
      },
      "nearest-mrt-station": {
        type: ["string", "null"],
        enum: [...mrtStations.map((i) => i.slug), null],
        default: null
      },
      area: {
        type: ["string", "null"],
        enum: [...areas.map((i) => i.slug), null],
        default: null
      }
    }
  };

  return withEnums;
}

export default async function nlToQuery(
  nl: string
): Promise<PartialRealEstateQuery> {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "user",
        content: `
          Search for properties based on the following query.
          Set both the min-price and max-price within a 10% range of the users budget, unless the user specifies a range already
          Set availability to rent if the user specifies a monthly price
        `
      },
      {
        role: "user",
        content: nl
      }
    ],
    functions: [
      {
        name: "queryProperties",
        description: "Searches for properties based on a set of filters",
        parameters: await generateSchema()
      }
    ]
  });

  return JSON.parse(res.data.choices[0].message!.function_call!.arguments!);
}
