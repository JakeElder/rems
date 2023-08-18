import { openai, ChatCompletionRequest, RemiResponse } from "@/remi";

type Parsable<T> = {
  parse: (object: any) => T;
};

const execute = async <Returns>(
  request: ChatCompletionRequest,
  Schema: Parsable<Returns>
): Promise<RemiResponse<Returns>> => {
  try {
    const res = await openai.createChatCompletion(request, { timeout: 8000 });
    const message = res.data.choices[0].message!;

    try {
      const json = JSON.parse(message.function_call!.arguments!);
      return {
        ok: true,
        data: Schema.parse(json)
      };
    } catch (e) {
      console.dir(
        {
          error: true,
          message: `PARSE_ERROR: ${message.function_call!.arguments}`
        },
        { colors: true }
      );
      return { ok: false, error: "PARSE_ERROR" };
    }
  } catch (e: any) {
    console.dir(e.response.data, { colors: true });
    return { ok: false, error: e.response.data };
  }
};

export default execute;
