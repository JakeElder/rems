import { openai } from "@/remi";
export const getModels = async () => openai.models.list();
