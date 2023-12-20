import OpenAI from "openai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ZodType, ZodTypeDef } from "zod";
import { ChatCompletionCreateParams } from "../types";
import { OpenAIModel, TimelineEvent } from "@rems/types";
import uuid from "short-uuid";
import md from "@rems/utils/md";

export const $event = <T extends TimelineEvent["role"]>(
  role: T,
  event: Extract<TimelineEvent, { role: T }>["event"]
) => ({
  id: uuid.generate(),
  date: Date.now(),
  role,
  event
});

export const $model = (
  type: OpenAIModel | "DEFAULT" = "DEFAULT"
): { model: OpenAIModel } => {
  if (type === "DEFAULT") {
    return { model: "gpt-4-1106-preview" };
  }
  return { model: type };
};

export const $request = (props: ChatCompletionCreateParams) => props;

export const $messages = (
  ...messages: ChatCompletionCreateParams["messages"]
): Pick<ChatCompletionCreateParams, "messages"> => {
  return { messages };
};

export const $systemMessage = (
  content: React.ReactNode
): OpenAI.Chat.Completions.ChatCompletionSystemMessageParam => ({
  role: "system",
  content: md(content)
});

export const $userMessage = (
  content: React.ReactNode
): OpenAI.Chat.Completions.ChatCompletionUserMessageParam => ({
  role: "user",
  content: md(content)
});

export const $functionCall = ({
  description,
  returnsSchema
}: {
  description?: React.ReactNode;
  returnsSchema: ZodType<any, ZodTypeDef, any>;
}): Pick<ChatCompletionCreateParams, "function_call" | "functions"> => {
  return {
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        parameters: zodToJsonSchema(returnsSchema),
        ...(description ? { description: md(description) } : {})
      }
    ]
  };
};
