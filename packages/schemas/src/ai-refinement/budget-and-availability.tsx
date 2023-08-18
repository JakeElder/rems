import { z } from "zod";
import InputSchema from "./input";
import { BudgetAndAvailability } from "../real-estate-query";

export const ArgsSchema = z.tuple([InputSchema, BudgetAndAvailability]);

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
