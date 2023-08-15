import { openai } from "@/remi";
export const getModels = async () => openai.listModels();
