import { txt } from "../utils";
import { z } from "zod";

const ContextSchema = z
  .object({})
  .describe(txt(<>Additional context that helps Remi make a decision.</>));

export default ContextSchema;
