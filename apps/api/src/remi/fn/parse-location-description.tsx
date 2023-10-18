import { RemiResponse, ChatCompletionRequest } from "@/remi/types";
import * as utils from "@/remi/utils";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";
import { Z } from "@rems/types";

const ReturnsSchema = z.object({
  geospatialOperator: z
    .string()
    .describe(utils.txt(<>IE "in", "around", "near"</>)),
  description: z.string().describe(utils.txt(<>The location</>)),
  ambiguous: z
    .boolean()
    .describe(
      utils.txt(
        <>
          Whether or not the location is ambiguous or explicit. IE "Bangkok" is
          explicit. "A nice coffee shop in Bangkok" is ambgious.
        </>
      )
    )
});

type Returns = Z<typeof ReturnsSchema>;

const parseLocationDescription = async (
  description: string
): Promise<RemiResponse<Returns>> => {
  const request: ChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Parse this location" },
      { role: "user", content: description }
    ],
    function_call: { name: "f" },
    functions: [{ name: "f", parameters: zodToJsonSchema(ReturnsSchema) }]
  };

  return utils.execute.fn(request, ReturnsSchema);
};

export default parseLocationDescription;
