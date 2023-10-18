import z from "zod";
import { MAX_PURCHASE_PRICE, MAX_RENTAL_PRICE } from "../constants";

const SaleBudgetAndAvailabilityRequirementsSchema = z.object({
  type: z.literal("SALE"),
  minPrice: z.number().default(0).catch(0),
  maxPrice: z
    .number()
    .max(MAX_PURCHASE_PRICE)
    .nullable()
    .default(null)
    .catch(null)
});

const RentBudgetAndAvailabilityRequirementsSchema = z.object({
  type: z.literal("RENT"),
  minPrice: z.number().default(0).catch(0),
  maxPrice: z
    .number()
    .max(MAX_RENTAL_PRICE)
    .nullable()
    .default(null)
    .catch(null)
});

const BudgetAndAvailabilityRequirementsSchema = z.discriminatedUnion("type", [
  SaleBudgetAndAvailabilityRequirementsSchema,
  RentBudgetAndAvailabilityRequirementsSchema
]);

export default BudgetAndAvailabilityRequirementsSchema;
