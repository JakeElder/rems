import { Filter, OpenAIModel } from "@rems/types";
import { CreateChatCompletionRequest as OriginalRequest } from "openai";

export type RemiResponse<T> =
  | null
  | { ok: true; data: T }
  | { ok: false; error: any };

export type ChatCompletionRequest = Omit<OriginalRequest, "model"> & {
  model: OpenAIModel;
};

export type ReviseArrayReturn = RemiResponse<Filter["slug"][]>;

export type ReviseArrayFn = (
  nl: string,
  current: Filter["slug"][]
) => Promise<ReviseArrayReturn>;
