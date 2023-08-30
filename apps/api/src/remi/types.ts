import { Filter, OpenAIModel } from "@rems/types";
import { CreateChatCompletionRequest as OriginalRequest } from "openai";

export type RemiFn = (...args: any) => Promise<RemiResponse>;

export type RemiResponse<T = any> =
  | { ok: true; data: T }
  | { ok: false; error: any };

export type ChatCompletionRequest = Omit<OriginalRequest, "model"> & {
  model: OpenAIModel;
};

export type RefineArrayReturn = RemiResponse<Filter["slug"][] | undefined>;

export type RefineArrayFn = (
  nl: string,
  current: Filter["slug"][]
) => Promise<RefineArrayReturn>;
