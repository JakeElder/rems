import { z } from "zod";
import { txt } from "../utils";
import {
  RealEstateQuerySchema,
  TerseCapabilitySchema,
  TimelineSchema
} from "..";

export const ContextSchema = z.object({
  query: RealEstateQuerySchema.Server.extend({}).describe(
    txt(<>The currently active query</>)
  ),
  capabilities: z.array(TerseCapabilitySchema)
});

export const ArgsSchema = ContextSchema.extend({
  timeline: TimelineSchema
});

export const ReturnsSchema = z.string();
