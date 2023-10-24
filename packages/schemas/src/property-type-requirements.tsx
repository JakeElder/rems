import z from "zod";
import { FilterSchema } from "./filter";

export const PropertyTypeRequirementsSchema = z.array(FilterSchema);
