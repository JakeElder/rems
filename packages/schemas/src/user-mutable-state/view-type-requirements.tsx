import z from "zod";
import { FilterSchema } from "../filter";

const ViewTypeRequirementsSchema = z.array(FilterSchema).default([]);

export default ViewTypeRequirementsSchema;
