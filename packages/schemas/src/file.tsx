import { z } from "zod";

export const FileSchema = z.object({
  id: z.number(),
  name: z.string().max(255).nullable(),
  alternativeText: z.string().max(255).nullable(),
  caption: z.string().max(255).nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  formats: z.record(z.any()).nullable(),
  hash: z.string().max(255).nullable(),
  ext: z.string().max(255).nullable(),
  mime: z.string().max(255).nullable(),
  size: z.coerce.number().nullable(),
  url: z.string().max(255).nullable(),
  previewUrl: z.string().max(255).nullable(),
  provider: z.string().max(255).nullable(),
  providerMetadata: z.record(z.any()).nullable(),
  folderPath: z.string().max(255).nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
});
