import { RemiResponse } from "@/remi/types";
import { $messages, $model, $request, $systemMessage } from "@/remi/wrappers";
import { execute } from "@/remi/utils";
import { z } from "zod";
import md from "@rems/utils/md";
import { TravelDetails } from "@rems/types";

const ReturnsSchema = z
  .object({ s: z.string().describe(md(<>The summary</>)) })
  .transform(({ s }) => s);

type Props = TravelDetails;
type Returns = z.infer<typeof ReturnsSchema>;

const chooseOneProperty = async (
  details: Props
): Promise<RemiResponse<Returns>> => {
  const request = $request({
    ...$model("gpt-3.5-turbo-16k"),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You are Remi, a terse, cute, witty, female, Thai born, bi-lingual
            (Thai, English) assistant responsible for helping the user of a real
            estate website.
          </p>
          <p>Summarize these travel details: {JSON.stringify(details)}</p>
          <p>
            focus on how long it would take, how many different forms of
            transport it would take, and give details about cost and which
            public transport stations should be used.
          </p>
          <p>
            Condense to one sentence. don't give specific times, instead -
            assume it's a general enquiry that doesn't begin at a specific time.
          </p>
        </>
      )
    )
  });

  return execute.chat(request);
};

export default chooseOneProperty;
