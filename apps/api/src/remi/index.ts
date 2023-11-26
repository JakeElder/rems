import OpenAI from "openai";

export const openai = new OpenAI(
  { apiKey: process.env.OPENAI_KEY }
);

export { default as capabilities } from "./capabilities";
export { default as intents } from "./intents";
