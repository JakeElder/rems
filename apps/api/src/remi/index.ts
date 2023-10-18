import { Configuration, OpenAIApi } from "openai";

export const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

export { default as capabilities } from "./capabilities";
export { default as intents } from "./intents";
