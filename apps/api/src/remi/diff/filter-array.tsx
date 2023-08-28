import {
  txt,
  ChatCompletionRequest,
  execute,
  RemiResponse,
  stringify,
  mapFilters
} from "@/remi";
import { AiDiff } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Filter } from "@rems/types";

const { ReturnsSchema, ContextSchema, ArgsSchema } = AiDiff.FilterArray;

type Args = z.infer<typeof ArgsSchema>;
type Context = z.infer<typeof ContextSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Filter["slug"][]>>;

const factory = (type: string, filtersPromise: Promise<Filter[]>): Fn => {
  return async (input, current) => {
    const filters = await filtersPromise;
    const context = stringify<Context>(
      ContextSchema.parse({
        input,
        filters,
        current: mapFilters.slugsToIds(filters, current)
      })
    );

    console.log(context);

    const request: ChatCompletionRequest = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: txt(
            <>
              <p>
                You are Remi, an assistant responsible for helping the user of a
                real estate website. Your task is to process their input and
                identify what "{type}" filters they want to add or remove based
                on their input.
              </p>
              <p>
                This is the context required to perform this task `{context}`
              </p>
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
          description: txt(<>Patches the array of {type}.</>),
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
};

export default factory;
