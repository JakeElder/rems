import z from "zod";
import { FilterSchema } from "./filter";

export const ViewTypeRequirementsSchema = z.array(FilterSchema);
