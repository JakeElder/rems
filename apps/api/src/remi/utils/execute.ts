import { openai, ChatCompletionRequest, RemiResponse } from "@/remi";

type Parsable<T> = {
  parse: (object: any) => T;
};

const fn = async <Returns>(
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
      return {
        ok: false,
        error: {
          type: "PARSE_ERROR",
          data: message.function_call!.arguments
        }
      };
    }
  } catch (e: any) {
    return {
      ok: false,
      error: e?.response?.data || e
    };
  }
};

const chat = async (
  request: ChatCompletionRequest
): Promise<RemiResponse<string>> => {
  try {
    const res = await openai.createChatCompletion(request, { timeout: 8000 });
    const message = res.data.choices[0].message!;

    if (!message.content) {
      return {
        ok: false,
        error: "Empty message"
      };
    }

    return {
      ok: true,
      data: message.content
    };
  } catch (e: any) {
    return {
      ok: false,
      error: e?.response?.data || e
    };
  }
};

export default { fn, chat };
