import { z } from "zod";
import { txt } from "../utils";
import NlInputSchema from "../nl-input";
import { Pagination } from "../real-estate-query";
import { CapabilitySchema, RealEstateQuerySchema } from "..";

export const ContextSchema = z.object({
  input: NlInputSchema,
  query: RealEstateQuerySchema.Server.extend({}).describe(
    txt(<>The currently active query</>)
  ),
  properties: Pagination.extend({}).describe(
    txt(
      <>The pagination data for properties shown based on the current query</>
    )
  ),
  capabilities: z.array(CapabilitySchema)
});

export const ArgsSchema = ContextSchema;

export const ReturnsSchema = z
  .object({
    r: z
      .string()
      .describe(
        txt(
          <>
            The natural language response to be sent to the user, sent as "Remi"
          </>
        )
      )
  })
  .transform(({ r }) => r);
