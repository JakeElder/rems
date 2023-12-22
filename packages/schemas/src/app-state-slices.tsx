import { z } from "zod";
import { RealEstateQuerySchema } from "./real-estate-query";
import { AssistantStateSchema } from "./assistant-state";
import md from "@rems/utils/md";
import { PropertySchema } from "./property";

export const AppStateSlicesSchema = z.object({
  realEstateQuery: RealEstateQuerySchema,
  stagedRealEstateQuery: RealEstateQuerySchema,
  assistant: AssistantStateSchema,
  keyboard: z.object({
    spaceDown: z.boolean(),
    enterDown: z.boolean()
  }),
  selectedPropertyId: PropertySchema.shape["id"]
    .nullable()
    .describe(
      md(
        <>
          The currently selected property. The user can ask questions related to
          this property.
        </>
      )
    )
});
