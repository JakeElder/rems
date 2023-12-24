import { z } from "zod";
import { PropertySchema } from "./property";
import md from "@rems/utils/md";

export const SelectedPropertiesManifestSchema = z
  .tuple([
    z.object({
      role: z.literal("USER"),
      id: PropertySchema.shape["id"].nullable()
    }),
    z.object({
      role: z.literal("ASSISTANT"),
      id: PropertySchema.shape["id"].nullable()
    })
  ])
  .describe(
    md(
      <>
        The currently selected properties. The user can ask questions about
        these properties.
      </>
    )
  );
