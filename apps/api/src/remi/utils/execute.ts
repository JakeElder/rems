import { openai } from "@/remi";
import { ChatCompletionRequest, RemiResponse } from "@/remi/types";
import { ZodType, ZodTypeDef } from "zod";

const fn = async <Returns>(
  request: ChatCompletionRequest,
  Schema: ZodType<any, ZodTypeDef, any>
): Promise<RemiResponse<Returns>> => {
  try {
    const res = await openai.chat.completions.create(request, { timeout: 14000 });
    const message = res.choices[0].message!;

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
    const res = await openai.chat.completions.create(request, { timeout: 8000 });
    const message = res.choices[0].message!;

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
