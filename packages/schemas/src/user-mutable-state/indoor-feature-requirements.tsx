import z from "zod";
import { FilterSchema } from "../filter";

const IndoorFeatureRequirementsSchema = z.array(FilterSchema).default([]);

export default IndoorFeatureRequirementsSchema;
