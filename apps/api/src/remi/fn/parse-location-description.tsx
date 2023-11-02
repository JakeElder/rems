import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage,
  $userMessage
} from "@/remi/wrappers";
import { execute } from "@/remi/utils";
import { z } from "zod";
import { Z } from "@rems/types";
import md from "@rems/utils/md";

const ReturnsSchema = z.object({
  geospatialOperator: z.string().describe(md(<>IE "in", "around", "near"</>)),
  description: z.string().describe(md(<>The location</>)),
  ambiguous: z
    .boolean()
    .describe(
      md(
        <>
          Whether or not the location is ambiguous or explicit. IE "Bangkok" is
          explicit. "A nice coffee shop in Bangkok" is ambigous.
        </>
      )
    )
});

type Returns = Z<typeof ReturnsSchema>;

const parseLocationDescription = async (
  description: string
): Promise<RemiResponse<Returns>> => {
  const request = $request({
    ...$model("gpt-3.5-turbo-0613"),
    ...$messages(
      $systemMessage("Parse this location"),
      $userMessage(description)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default parseLocationDescription;
