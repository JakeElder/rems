import { z } from "zod";

export const AppConfigSchema = z.object({
  id: z.number(),
  defaultTitle: z.string().nullable(),
  defaultDescription: z.string().nullable(),
  notificationEmail: z.string(),
  lineUrl: z.string().nullable(),
  instagramUrl: z.string().nullable(),
  linkedInUrl: z.string().nullable(),
  facebookUrl: z.string().nullable()
});

export default AppConfigSchema;
