import { z } from "zod";

export const FileSchema = z.object({
  id: z.number(),
  name: z.string().max(255).nullable().default(null),
  alternativeText: z.string().max(255).nullable().default(null),
  caption: z.string().max(255).nullable().default(null),
  width: z.number().nullable().default(null),
  hash: z.string().max(255).nullable().default(null),
  ext: z.string().max(255).nullable().default(null),
  mime: z.string().max(255).nullable().default(null),
  size: z.coerce.number().nullable().default(null),
  url: z.string().max(255).nullable().default(null),
  previewUrl: z.string().max(255).nullable().default(null),
  provider: z.string().max(255).nullable().default(null),
  providerMetadata: z.record(z.any()).nullable().default(null),
  folderPath: z.string().max(255).nullable().default(null),
  createdAt: z.date().nullable().default(null),
  updatedAt: z.date().nullable().default(null)
});
