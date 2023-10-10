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
  RealEstateQuerySchema,
  TerseIntentSchema
} from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatCompletionRequestMessage } from "openai";
import { Z } from "@rems/types";
import * as Models from "@/models";
import { Model } from "sequelize";

const { ArgsSchema, ReturnsSchema, ContextSchema } = AiCapability.Analyze;

type Args = Z<typeof ArgsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Returns>>;

const analyze: Fn = async ({ input, query, chatContext }) => {
  const parse = (r: Model<any, any>[]) => r.map((m: any) => m.slug);
  const [
    lotFeatures,
    outdoorFeatures,
    indoorFeatures,
    viewTypes,
    propertyTypes
  ] = await Promise.all([
    Models.LotFeature.findAll({ raw: true }).then(parse),
    Models.OutdoorFeature.findAll({ raw: true }).then(parse),
    Models.IndoorFeature.findAll({ raw: true }).then(parse),
    Models.ViewType.findAll({ raw: true }).then(parse),
    Models.PropertyType.findAll({ raw: true }).then(parse)
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

  const context = stringify<Context>({
    chatContext,
    input,
    indoorFeatures,
    outdoorFeatures,
    lotFeatures,
    viewTypes,
    propertyTypes,
    intents: intents.map((i) => TerseIntentSchema.parse(i)),
    currentQuery
  });

  const instruction: ChatCompletionRequestMessage["content"] = txt(
    <>
      <p>
        You are Remi, an assistant responsible for helping the user of a real
        estate website. Your task is to process their input and analyze it for
        their intents
      </p>
      <p>Here is context: `{context}`</p>
    </>
  );

  const request: ChatCompletionRequest = {
    model: "gpt-4",
    messages: [{ role: "system", content: instruction }],
    function_call: { name: "f" },
    functions: [{ name: "f", parameters: zodToJsonSchema(ReturnsSchema) }]
  };

  return execute(request, ReturnsSchema);
};

export default analyze;
