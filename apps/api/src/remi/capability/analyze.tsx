import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  intents,
  stringify
} from "@/remi";
import {
  AiCapability,
  FilterSchema,
  RealEstateQuerySchema
} from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as Models from "@/models";
import { ChatCompletionRequestMessage } from "openai";

const { ArgsSchema, ReturnsSchema, ContextSchema } = AiCapability.Analyze;

type Args = z.infer<typeof ArgsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const analyze: Fn = async (nl, query) => {
  const [
    lotFeatures,
    outdoorFeatures,
    indoorFeatures,
    viewTypes,
    propertyTypes
  ] = await Promise.all([
    Models.LotFeature.findAll({ raw: true }),
    Models.OutdoorFeature.findAll({ raw: true }),
    Models.IndoorFeature.findAll({ raw: true }),
    Models.ViewType.findAll({ raw: true }),
    Models.PropertyType.findAll({ raw: true })
  ]);

  const currentQuery: z.infer<(typeof ContextSchema.shape)["currentQuery"]> = {
    VIEW_TYPES: query["view-types"],
    PROPERTY_TYPES: query["property-types"],
    LOT_FEATURES: query["lot-features"],
    OUTDOOR_FEATURES: query["outdoor-features"],
    INDOOR_FEATURES: query["indoor-features"],
    BUDGET_AND_AVAILABILITY:
      RealEstateQuerySchema.BudgetAndAvailability.parse(query),
    MAP_STATE: RealEstateQuerySchema.MapState.parse(query),
    SPACE_REQUIREMENTS: RealEstateQuerySchema.SpaceRequirements.parse(query),
    SORT: query["sort"],
    PAGE: query["page"],
    LOCATION: RealEstateQuerySchema.Origin.parse(query)
  };

  const context = stringify(
    ContextSchema.parse({
      indoorFeatures,
      outdoorFeatures,
      lotFeatures,
      viewTypes,
      propertyTypes,
      intents,
      currentQuery
    })
  );

  const schema = stringify(zodToJsonSchema(ContextSchema));

  const instruction: ChatCompletionRequestMessage["content"] = txt(
    <>
      <p>
        You are Remi, an assistant responsible for helping the user of a real
        estate website. Your task is to process their input and analyze it, so
        that it can be further processed and actioned.
      </p>
      <p>Here is additional context to assist with the analysis: `{context}`</p>
      <p>Here is the schema of the context: `{schema}`</p>
      <p>The next message is the users input.</p>
    </>
  );

  const request: ChatCompletionRequest = {
    model: "gpt-4",
    messages: [
      { role: "system", content: instruction },
      { role: "user", content: nl }
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        description: txt(<>Further processes a users input/command.</>),
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute(request, ReturnsSchema);
};

export default analyze;
