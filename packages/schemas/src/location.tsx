import { z } from "zod";
import { txt } from "./utils";

export const Radius = z.coerce
  .number()
  .min(1000)
  .max(20_000)
  .default(5000)
  .catch(5000)
  .describe(
    txt(
      <>
        The radius from the search source to search for properties within.
        Specified in M².
      </>
    )
  );

export const LocationDisambiguationSchema = z
  .string()
  .describe(
    txt(
      <>
        The explicit resolution for an ambiguous location. IE if the source is
        "The capital of Thailand", the disambiguation is "Bangkok"
      </>
    )
  );

export const NlLocationSourceSchema = z.object({
  type: z.literal("NL"),
  source: z.string(),
  radius: Radius
});

export const LocationSourceSchema = z.discriminatedUnion("type", [
  NlLocationSourceSchema
]);

export const LocationSchema = z.object({
  source: LocationSourceSchema,
  disambiguation: LocationDisambiguationSchema
});
