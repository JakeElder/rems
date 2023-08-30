import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  intents,
  stringify
} from "@/remi";
import { AiCapability } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as Models from "@/models";
import { ChatCompletionRequestMessage } from "openai";

const { ArgsSchema, ReturnsSchema, ContextSchema } = AiCapability.Analyze;

type Args = z.infer<typeof ArgsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const analyze: Fn = async (nl) => {
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

  const context = stringify(
    ContextSchema.parse({
      indoorFeatures,
      outdoorFeatures,
      lotFeatures,
      viewTypes,
      propertyTypes,
      intents
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
