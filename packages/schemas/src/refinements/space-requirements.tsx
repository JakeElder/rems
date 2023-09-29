import { z } from "zod";
import { SpaceRequirements } from "../real-estate-query";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({
  timeline: TimelineSchema,
  current: SpaceRequirements
});

export const ArgsSchema = ContextSchema;

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
