import z from "zod";
import { MAX_PURCHASE_PRICE, MAX_RENTAL_PRICE } from "../constants";

const SaleBudgetAndAvailabilityRequirementsSchema = z.object({
  type: z.literal("SALE"),
  minPrice: z.number(),
  maxPrice: z.number().max(MAX_PURCHASE_PRICE).nullable()
});

const RentBudgetAndAvailabilityRequirementsSchema = z.object({
  type: z.literal("RENT"),
  minPrice: z.number(),
  maxPrice: z.number().max(MAX_RENTAL_PRICE).nullable()
});

const BudgetAndAvailabilityRequirementsSchema = z.discriminatedUnion("type", [
  SaleBudgetAndAvailabilityRequirementsSchema,
  RentBudgetAndAvailabilityRequirementsSchema
]);

export default BudgetAndAvailabilityRequirementsSchema;
