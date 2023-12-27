import { z } from "zod";
import { RealEstateQuerySchema } from "./real-estate-query";
import { AssistantStateSchema } from "./assistant-state";
import { SelectedPropertiesManifestSchema } from "./selected-properties-manifest";

export const AppStateSlicesSchema = z.object({
  realEstateQuery: RealEstateQuerySchema,
  stagedRealEstateQuery: RealEstateQuerySchema,
  assistant: AssistantStateSchema,
  keyboard: z.object({
    spaceDown: z.boolean(),
    enterDown: z.boolean()
  }),
  results: z.object({
    selectedProperties: SelectedPropertiesManifestSchema,
    showDistance: z.boolean()
  })
});
