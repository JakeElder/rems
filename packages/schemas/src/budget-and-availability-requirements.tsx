import z from "zod";
import { MAX_PURCHASE_PRICE, MAX_RENTAL_PRICE } from "./constants";

export const SaleBudgetAndAvailabilityRequirementsSchema = z.object({
  type: z.literal("SALE"),
  minPrice: z.number(),
  maxPrice: z.number().max(MAX_PURCHASE_PRICE).nullable()
});

export const RentBudgetAndAvailabilityRequirementsSchema = z.object({
  type: z.literal("RENT"),
  minPrice: z.number(),
  maxPrice: z.number().max(MAX_RENTAL_PRICE).nullable()
});

export const BudgetAndAvailabilityRequirementsSchema = z.discriminatedUnion(
  "type",
  [
    SaleBudgetAndAvailabilityRequirementsSchema,
    RentBudgetAndAvailabilityRequirementsSchema
  ]
);
