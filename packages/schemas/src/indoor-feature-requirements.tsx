import z from "zod";
import { FilterSchema } from "./filter";

export const IndoorFeatureRequirementsSchema = z.array(FilterSchema);
