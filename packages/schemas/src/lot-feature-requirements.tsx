import z from "zod";
import { FilterSchema } from "./filter";

export const LotFeatureRequirementsSchema = z.array(FilterSchema);
