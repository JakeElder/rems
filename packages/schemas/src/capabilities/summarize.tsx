import { z } from "zod";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({ timeline: TimelineSchema });

export const ArgsSchema = ContextSchema;

export const ReturnsSchema = z.string();
