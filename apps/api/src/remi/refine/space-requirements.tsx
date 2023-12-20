import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { execute, stringify, timelineToCompletionMessages } from "@/remi/utils";
import { SpaceRequirementsSchema, TimelineSchema } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const ContextSchema = z.object({
  current: SpaceRequirementsSchema
});

export const ArgsSchema = z.object({
  timeline: TimelineSchema,
  current: SpaceRequirementsSchema
});

export const ReturnsSchema = z
  .object({
    mnbd: SpaceRequirementsSchema.shape["minBedrooms"],
    mxbd: SpaceRequirementsSchema.shape["maxBedrooms"],
    mnbt: SpaceRequirementsSchema.shape["minBathrooms"],
    mnlva: SpaceRequirementsSchema.shape["minLivingArea"],
    mxlva: SpaceRequirementsSchema.shape["maxLivingArea"],
    mnls: SpaceRequirementsSchema.shape["minLotSize"],
    mxls: SpaceRequirementsSchema.shape["maxLotSize"]
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
