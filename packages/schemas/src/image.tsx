import { z } from "zod";
import { FileSchema } from "./file";

export const ImageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("local"),
    props: FileSchema.extend({
      width: z.number(),
      height: z.number(),
      url: z.string().max(255)
    })
  }),
  z.object({
    type: z.literal("cloudinary"),
    props: FileSchema.extend({
      width: z.number(),
      height: z.number(),
      id: z.string()
    })
  })
]);
