import {
  txt,
  ChatCompletionRequest,
  execute,
  RemiResponse,
  stringify
} from "@/remi";
import { AiDiff, FilterSchema } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as Models from "@/models";
import { Filter } from "@rems/types";

const { ArgsSchema, ReturnsSchema, ContextSchema } = AiDiff.IndoorFeatures;

type Args = z.infer<typeof ArgsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Filter["slug"][]>>;

type Context = z.infer<typeof ContextSchema>;

const indoorFeatures: Fn = async (input, current) => {
  const raw = await Models.IndoorFeature.findAll({ raw: true });
  const filters = raw.map((r) => FilterSchema.parse(r));

  const context = stringify<Context>({
    input,
    filters,
    current: current.map((slug) => filters.find((f) => f.slug === slug)!.id)
  });

  const request: ChatCompletionRequest = {
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You are Remi, an assistant responsible for helping the user of a
              real estate website. Your task is to process their input and
              identify what "Indoor Features" filters they want to add or remove
              based on their input.
            </p>
            <p>This is the context required to perform this task `{context}`</p>
            <p>
              This is the schema of the context: `
              {stringify(zodToJsonSchema(ContextSchema))}`
            </p>
          </>
        )
      },
      { role: "user", content: input }
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        description: txt(<>Patches the array of Indoor Features.</>),
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  const res = await execute(request, ReturnsSchema);

  if (res?.ok) {
    return {
      ...res,
      data: res.data.map((id) => filters.find((f) => f.id === id)!.slug)
    };
  }

  return res;
};

export default indoorFeatures;
