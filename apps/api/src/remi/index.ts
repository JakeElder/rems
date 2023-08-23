import { Configuration, OpenAIApi } from "openai";

export const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

export { default as txt } from "./utils/txt";
export { default as execute } from "./utils/execute";
export { default as stringify } from "./utils/stringify";

export * from "./types";
export * as refine from "./refine";
export * as diff from "./diff";
export * as capability from "./capability";

export { default as capabilities } from "./capabilities";
export { default as intents } from "./intents";
