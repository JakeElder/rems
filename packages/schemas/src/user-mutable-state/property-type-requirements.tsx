import z from "zod";
import { FilterSchema } from "../filter";

const PropertyTypeRequirementsSchema = z.array(FilterSchema);

export default PropertyTypeRequirementsSchema;
