import { ChatCompletionRequestMessageFunctionCall } from "openai";
import { Filter, OpenAIModel } from "@rems/types";
import { CreateChatCompletionRequest as OriginalRequest } from "openai";

export type RemiResponse<T> =
  | null
  | { ok: true; data: T }
  | { ok: false; error: any };

export type ChatCompletionRequest = Omit<OriginalRequest, "model"> & {
  model: OpenAIModel;
};

export type RefineArrayReturn = RemiResponse<Filter["slug"][]>;

export type RefineArrayFn = (
  nl: string,
  current: Filter["slug"][]
) => Promise<RefineArrayReturn>;

export type CapabilityCode = "NQ" | "RQ" | "CQ" | "SP" | "RV" | "RGQ";

export type ExecuteReturn =
  | { error: false; fc: ChatCompletionRequestMessageFunctionCall }
  | { error: true; message: string };
