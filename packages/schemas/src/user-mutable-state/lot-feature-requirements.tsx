import z from "zod";
import { FilterSchema } from "../filter";

const LotFeatureRequirementsSchema = z.array(FilterSchema).default([]);

export default LotFeatureRequirementsSchema;
