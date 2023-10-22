import z from "zod";
import { FilterSchema } from "../filter";

const LotFeatureRequirementsSchema = z.array(FilterSchema);

export default LotFeatureRequirementsSchema;
