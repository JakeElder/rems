import { Configuration, OpenAIApi } from "openai";

export const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

export { default as txt } from "./utils/txt";
export * from "./types";
export * as revise from "./revise";
export * as capability from "./capability";
