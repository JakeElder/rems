import z from "zod";
import { FilterSchema } from "../filter";

const ViewTypeRequirementsSchema = z.array(FilterSchema);

export default ViewTypeRequirementsSchema;
