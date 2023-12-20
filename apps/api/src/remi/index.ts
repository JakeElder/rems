import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export { default as intents } from "./intents";
