import { openai, ChatCompletionRequest, ExecuteReturn } from "@/remi";

const execute = async (
  request: ChatCompletionRequest
): Promise<ExecuteReturn> => {
  try {
    const res = await openai.createChatCompletion(request);
    const message = res.data.choices[0].message!;
    return { error: false, fc: message.function_call! };
  } catch (e: any) {
    return { error: true, message: e.response.data };
  }
};

export default execute;
