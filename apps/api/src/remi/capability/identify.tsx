import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  capabilities,
  stringify
} from "@/remi";
import { AiCapability, RealEstateQuerySchema } from "@rems/schemas";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatCompletionRequestMessage } from "openai";
import { Z } from "@rems/types";
import * as Models from "@/models";
import { Model } from "sequelize";

const { ArgsSchema, ReturnsSchema, ContextSchema } = AiCapability.Identify;

type Args = Z<typeof ArgsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const analyze: Fn = async (nl) => {
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

  const context = stringify<Context>({
    indoorFeatures,
    outdoorFeatures,
    lotFeatures,
    viewTypes,
    propertyTypes,
    capabilities,
    queryStructure: {
      LOCATION: zodToJsonSchema(RealEstateQuerySchema.Origin),
      MAP_STATE: zodToJsonSchema(RealEstateQuerySchema.MapState),
      PAGE: zodToJsonSchema(RealEstateQuerySchema.Page),
      SORT: zodToJsonSchema(RealEstateQuerySchema.Sort),
      SPACE_REQUIREMENTS: zodToJsonSchema(
        RealEstateQuerySchema.SpaceRequirements
      ),
      BUDGET_AND_AVAILABILITY: zodToJsonSchema(
        RealEstateQuerySchema.BudgetAndAvailability
      ),
      INDOOR_FEATURES: zodToJsonSchema(
        RealEstateQuerySchema.Arrays.shape["indoor-features"]
      ),
      LOT_FEATURES: zodToJsonSchema(
        RealEstateQuerySchema.Arrays.shape["lot-features"]
      ),
      OUTDOOR_FEATURES: zodToJsonSchema(
        RealEstateQuerySchema.Arrays.shape["outdoor-features"]
      ),
      PROPERTY_TYPES: zodToJsonSchema(
        RealEstateQuerySchema.Arrays.shape["property-types"]
      ),
      VIEW_TYPES: zodToJsonSchema(
        RealEstateQuerySchema.Arrays.shape["view-types"]
      )
    }
  });
  const schema = stringify(zodToJsonSchema(ContextSchema));

  const instruction: ChatCompletionRequestMessage["content"] = txt(
    <>
      <p>
        You are an assistant responsible for helping the user of a real estate
        website. Your task is to analyze their input and assess which of our
        capabilities should be used to react to the user.
      </p>
      <p>Here is additional context: `{context}`</p>
      <p>This is the schema of the context: `{schema}`</p>
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
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute(request, ReturnsSchema);
};

export default analyze;
