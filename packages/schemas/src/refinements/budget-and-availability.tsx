import { z } from "zod";
import { BudgetAndAvailability } from "../real-estate-query";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({
  timeline: TimelineSchema,
  current: BudgetAndAvailability
});

export const ArgsSchema = ContextSchema;

export const ReturnsSchema = z
  .object({
    mn: BudgetAndAvailability.shape["min-price"],
    mx: BudgetAndAvailability.shape["max-price"],
    a: BudgetAndAvailability.shape["availability"]
  })
  .partial()
  .transform(({ mn, mx, a }) => ({
    "min-price": mn,
    "max-price": mx,
    availability: a
  }));
