import { Configuration, OpenAIApi } from "openai";

export const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

export { default as txt } from "./utils/txt";
export { default as execute } from "./utils/execute";
export * from "./types";
export * as refine from "./refine";
export * as capability from "./capability";

export { default as capabilities } from "./capabilities";
