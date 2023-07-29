import { z } from "zod";
import { FileSchema } from "./file";

export const ImageSchema = FileSchema.extend({
  width: z.number(),
  height: z.number(),
  url: z.string().max(255)
});
