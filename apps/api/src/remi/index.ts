import { Configuration, OpenAIApi } from "openai";

export const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

export { default as txt } from "./utils/txt";
export { default as execute } from "./utils/execute";
export { default as stringify } from "./utils/stringify";
export * as diff from "./utils/diff";
export * as terse from "./utils/terse";
export * as mapFilter from "./utils/map-filter";
export * as mapFilters from "./utils/map-filters";
export * as logger from "./utils/logger";

export * from "./types";
export * as refine from "./refine";
export * as capability from "./capability";

export { default as capabilities } from "./capabilities";
export { default as intents } from "./intents";
