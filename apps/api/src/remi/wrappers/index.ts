import { ChatCompletionRequestMessage } from "openai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { txt } from "@/remi/utils";
import { ZodType, ZodTypeDef } from "zod";
import { ChatCompletionRequest } from "../types";
import { OpenAIModel } from "@rems/types";

export const $model = (
  type: OpenAIModel | "DEFAULT" = "DEFAULT"
): { model: OpenAIModel } => {
  if (type === "DEFAULT") {
    return { model: "gpt-4" };
  }
  return { model: type };
};

export const $request = (props: ChatCompletionRequest) => props;

export const $messages = (
  ...messages: ChatCompletionRequest["messages"]
): Pick<ChatCompletionRequest, "messages"> => {
  return { messages };
};

export const $message = (
  role: ChatCompletionRequestMessage["role"],
  content: React.ReactNode
): ChatCompletionRequestMessage => {
  return { role, content: txt(content) };
};

export const $systemMessage = (
  content: React.ReactNode
): ChatCompletionRequestMessage => $message("system", content);

export const $functionCall = ({
  description,
  returnsSchema
}: {
  description?: React.ReactNode;
  returnsSchema: ZodType<any, ZodTypeDef, any>;
}): Pick<ChatCompletionRequest, "function_call" | "functions"> => {
  return {
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        parameters: zodToJsonSchema(returnsSchema),
        ...(description ? { description: txt(description) } : {})
      }
    ]
  };
};
