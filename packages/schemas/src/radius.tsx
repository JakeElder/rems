import { z } from "zod";

export const RadiusSchema = z.coerce
  .number()
  .nullable()
  .default(null)
  .catch(null);
