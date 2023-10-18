import z from "zod";
import { FilterSchema } from "../filter";

const OutdoorFeatureRequirementsSchema = z.array(FilterSchema).default([]);

export default OutdoorFeatureRequirementsSchema;
