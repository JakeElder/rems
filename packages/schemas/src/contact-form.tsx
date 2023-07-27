import { z } from "zod";

export const ContactFormSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    uid: z.string().default(""),
    message: z.string().default(""),
    phone: z.string().default("")
  })
  .partial()
  .required({ name: true, email: true });
