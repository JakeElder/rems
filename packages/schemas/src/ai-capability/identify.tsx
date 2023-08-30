import { z } from "zod";
import NlInputSchema from "../nl-input";
import { txt } from "../utils";
import { CapabilitySchema } from "..";

export const ArgsSchema = z.tuple([NlInputSchema]);

export const ContextSchema = z.object({
  capabilities: z.lazy(() => z.array(CapabilitySchema))
});

export const ReturnsSchema = z
  .object({
    c: CapabilitySchema.shape["id"].describe(
      txt(
        <>
          The id of the *Capability* that is best suited to service the user,
          given the input they have issued. It must be the id of a single
          capability from our defined set.
        </>
      )
    )
  })
  .transform(({ c }) => c);
