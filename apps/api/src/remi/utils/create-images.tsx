import { openai } from "@/remi";

export const createImages = async (prompt: string, n: number) => {
  const image = await openai.images.generate({
    size: "1024x1024",
    prompt,
    response_format: "b64_json",
    n
  });

  const isString = (s: any): s is string => !!s;
  return image.data.map((i) => i.b64_json).filter(isString);
};
