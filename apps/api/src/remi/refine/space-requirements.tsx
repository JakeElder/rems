import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, stringify, timelineToCompletionMessages } from "@/remi/utils";
import { RealEstateQuerySchema, TimelineSchema } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const { SpaceRequirements } = RealEstateQuerySchema;

export const ContextSchema = z.object({
  current: SpaceRequirements
});

export const ArgsSchema = z.object({
  timeline: TimelineSchema,
  current: SpaceRequirements
});

export const ReturnsSchema = z
  .object({
    mnbd: SpaceRequirements.shape["min-bedrooms"],
    mxbd: SpaceRequirements.shape["max-bedrooms"],
    mnbt: SpaceRequirements.shape["min-bathrooms"],
    mnlva: SpaceRequirements.shape["min-living-area"],
    mxlva: SpaceRequirements.shape["max-living-area"],
    mnls: SpaceRequirements.shape["min-lot-size"],
    mxls: SpaceRequirements.shape["max-lot-size"]
  })
  .partial()
  .transform(({ mnbd, mnbt, mnls, mxbd, mxls, mnlva, mxlva }) => ({
    "min-bedrooms": mnbd,
    "max-bedrooms": mxbd,
    "min-bathrooms": mnbt,
    "min-living-area": mnlva,
    "max-living-area": mxlva,
    "min-lot-size": mnls,
    "max-lot-size": mxls
  }));

type Args = z.infer<typeof ArgsSchema>;
type Context = z.infer<typeof ContextSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Returns>>;

const spaceRequirements: Fn = async ({ timeline, current }) => {
  const context = stringify<Context>({ current });
  const schema = stringify(zodToJsonSchema(ContextSchema));

  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You an assistant responsible for helping the user of a real estate
            website. Process their input and update the current query to reflect
            their space requirements. You are able to set location by landmarks
            or establishments.
          </p>
          <p>Useful context: `{context}`</p>
          <p>The context schema: `{schema}`</p>
        </>
      ),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({
      returnsSchema: ReturnsSchema
    })
  });

  return execute.fn(request, ReturnsSchema);
};

export default spaceRequirements;
