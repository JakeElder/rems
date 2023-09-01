import { z } from "zod";
import NlInputSchema from "../nl-input";
import { BudgetAndAvailability } from "../real-estate-query";

export const ArgsSchema = z.tuple([NlInputSchema, BudgetAndAvailability]);

export const ContextSchema = z.object({
  input: NlInputSchema,
  current: BudgetAndAvailability
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
