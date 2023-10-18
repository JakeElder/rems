import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage,
  $userMessage
} from "@/remi/wrappers";
import { execute, txt } from "@/remi/utils";
import { z } from "zod";
import { Z } from "@rems/types";

const ReturnsSchema = z.object({
  geospatialOperator: z.string().describe(txt(<>IE "in", "around", "near"</>)),
  description: z.string().describe(txt(<>The location</>)),
  ambiguous: z
    .boolean()
    .describe(
      txt(
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
