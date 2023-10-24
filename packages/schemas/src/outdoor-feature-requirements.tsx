import z from "zod";
import { FilterSchema } from "./filter";

export const OutdoorFeatureRequirementsSchema = z.array(FilterSchema);
