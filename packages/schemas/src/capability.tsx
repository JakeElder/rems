import { z } from "zod";
import { txt } from "./utils";

export const CapabilityCodeSchema = z
  .enum([
    "NEW_QUERY",
    "REFINE_QUERY",
    "CLEAR_QUERY",
    "SHOW_PROPERTY",
    "REQUEST_VIEWING",
    "RESPOND_GENERAL_QUERY",
    "INFORM_MORE_INFO_NEEDED"
  ])
  .describe(txt(<>A unique identifier for the capability</>));

export const CapabilitySchema = z
  .object({
    id: z.number().min(1),
    code: CapabilityCodeSchema,
    description: z
      .string()
      .describe(
        txt(
          <>
            A description of the capability, worded in a way that acts as
            documentation for someone that Remi is assisting. IE, the
            description describes to an end user how this capability can be
            utilised.
          </>
        )
      ),
    exampleTriggers: z
      .array(z.string())
      .describe(
        txt(
          <>
            Remi is a virtual assistant, that takes users input, processes their
            request and then performs the best suited capability in order to
            serve the user. This is a natural language array of strings that
            when issued by the user should trigger this capability.
          </>
        )
      )
  })
  .describe(
    txt(
      <>
        Remi is a virtual assistant. She can perform lots of actions to help
        users. This schema defines a capability. These capabilities are used
        implemented based on a users intent.
      </>
    )
  );

export const TerseCapabilitySchema = CapabilitySchema.pick({
  id: true,
  code: true
});
