import { Filter, OpenAIModel } from "@rems/types";
import OpenAI from "openai";

export type RemiResponse<T = any> =
  | { ok: true; data: T }
  | { ok: false; error: any };

export type RemiFn = (...args: any) => Promise<RemiResponse>;

export type ChatCompletionRequest = Omit<
  OpenAI.Chat.CreateChatCompletionRequestMessage,
  "model"
> & {
  model: OpenAIModel;
};

export type RefineArrayReturn = RemiResponse<Filter["slug"][] | undefined>;

export type RefineArrayFn = (
  nl: string,
  current: Filter["slug"][]
) => Promise<RefineArrayReturn>;
