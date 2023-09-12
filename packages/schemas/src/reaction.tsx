import { z } from "zod";
import { PatchSchema } from "./patch";

export const PatchReactionSchema = z.object({
  type: z.literal("PATCH"),
  group: z.enum([
    "LOCATION",
    "MAP_STATE",
    "PAGE",
    "SORT",
    "SPACE_REQUIREMENTS",
    "BUDGET_AND_AVAILABILITY",
    "INDOOR_FEATURES",
    "LOT_FEATURES",
    "OUTDOOR_FEATURES",
    "PROPERTY_TYPES",
    "VIEW_TYPES"
  ]),
  patch: PatchSchema
});

export const VerbalReactionSchema = z.object({
  type: z.literal("VERBAL"),
  message: z.string()
});

export const ReactionSchema = z.discriminatedUnion("type", [
  PatchReactionSchema,
  VerbalReactionSchema
]);
