import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, stringify, timelineToCompletionMessages } from "@/remi/utils";
import { FilterSchema, TimelineSchema } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Filter, Z } from "@rems/types";
import md from "@rems/utils/md";

export const ContextSchema = z.object({
  filters: z.array(FilterSchema.omit({ slug: true })),
  current: z
    .array(FilterSchema.omit({ slug: true }))
    .describe(md(<>Currently active filter id's</>))
});

export const PropsSchema = z.object({
  timeline: TimelineSchema,
  current: z.array(FilterSchema)
});

export const ReturnsSchema = z
  .object({
    n: z
      .array(FilterSchema.shape["id"])
      .describe(md(<>An array of updated filter ids</>))
  })
  .transform(({ n }) => n);

type Props = Z<typeof PropsSchema>;
type Context = Z<typeof ContextSchema>;

type Fn = (props: Props) => Promise<RemiResponse<Filter[]>>;

const factory = (type: string, filtersPromise: Promise<Filter[]>): Fn => {
  return async ({ timeline, current }) => {
    const filters = await filtersPromise;

    const context = stringify<Context>(
      ContextSchema.parse({ filters, current })
    );

    const schema = stringify(zodToJsonSchema(ContextSchema));

    const request = $request({
      ...$model(),
      ...$messages(
        $systemMessage(
          <>
            <p>
              You are an assistant responsible for helping the user of a real
              estate website. Process their input and identify what "{type}"
              filters they want to add or remove.
            </p>
            <p>Useful context: `{context}`</p>
            <p>The schema for this context: `{schema}`</p>
          </>
        ),
        ...timelineToCompletionMessages(timeline)
      ),
      ...$functionCall({ returnsSchema: ReturnsSchema })
    });

    const res = await execute.fn(request, ReturnsSchema);

    if (res?.ok) {
      return {
        ...res,
        data: res.data.map((id) => filters.find((f) => f.id === id)!)
      };
    }

    return res;
  };
};

export default factory;
