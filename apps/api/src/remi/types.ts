import { Filter, OpenAIModel } from "@rems/types";
import { CreateChatCompletionRequest as OriginalRequest } from "openai";

export type RemiResponse<T> =
  | null
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

export type CapabilityCode = "NQ" | "RQ" | "CQ" | "SP" | "RV" | "RGQ";
