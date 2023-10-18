import { ChatCompletionRequest, RemiResponse } from "@/remi/types";
import { execute, mapFilters, stringify, timelineToCompletionMessages, txt } from "@/remi/utils";
import { Refinements } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Filter } from "@rems/types";

const { ReturnsSchema, ContextSchema, ArgsSchema } = Refinements.FilterArray;

type Args = z.infer<typeof ArgsSchema>;
type Context = z.infer<typeof ContextSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Filter["slug"][]>>;

const factory = (type: string, filtersPromise: Promise<Filter[]>): Fn => {
  return async ({ timeline, current }) => {
    const filters = await filtersPromise;

    const context = stringify<Context>(
      ContextSchema.parse({
        filters,
        current: mapFilters.slugsToIds(filters, current)
      })
    );

    const schema = stringify(zodToJsonSchema(ContextSchema));

    const request: ChatCompletionRequest = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: txt(
            <>
              <p>
                You are an assistant responsible for helping the user of a real
                estate website. Process their input and identify what "{type}"
                filters they want to add or remove.
              </p>
              <p>Useful context: `{context}`</p>
              <p>The schema for this context: `{schema}`</p>
            </>
          )
        },
        ...timelineToCompletionMessages(timeline)
      ],
      function_call: { name: "f" },
      functions: [{ name: "f", parameters: zodToJsonSchema(ReturnsSchema) }]
    };

    const res = await execute.fn(request, ReturnsSchema);

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
