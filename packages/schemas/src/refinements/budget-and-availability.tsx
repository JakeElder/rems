import { z } from "zod";
import { BudgetAndAvailability } from "../real-estate-query";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({
  current: BudgetAndAvailability
});

export const ArgsSchema = z.object({
  current: BudgetAndAvailability,
  timeline: TimelineSchema
});

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
