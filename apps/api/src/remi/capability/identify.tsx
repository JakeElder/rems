import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  capabilities,
  stringify
} from "@/remi";
import { AiCapability } from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatCompletionRequestMessage } from "openai";

const { ArgsSchema, ReturnsSchema, ContextSchema } = AiCapability.Identify;

type Args = z.infer<typeof ArgsSchema>;
type Returns = z.infer<typeof ReturnsSchema>;
type Fn = (...args: Args) => Promise<RemiResponse<Returns>>;

const analyze: Fn = async (nl) => {
  const context = stringify(ContextSchema.parse({ capabilities }));
  const schema = stringify(zodToJsonSchema(ContextSchema));

  const instruction: ChatCompletionRequestMessage["content"] = txt(
    <>
      <p>
        You are an assistant responsible for helping the user of a real estate
        website. Your task is to analyze their input and assess which of our
        capabilities should be used to react to the user.
      </p>
      <p>Here is additional context: `{context}`</p>
      <p>This is the schema of the context: `{schema}`</p>
    </>
  );

  const request: ChatCompletionRequest = {
    model: "gpt-4",
    messages: [
      { role: "system", content: instruction },
      { role: "user", content: nl }
    ],
    function_call: { name: "f" },
    functions: [
      {
        name: "f",
        parameters: zodToJsonSchema(ReturnsSchema)
      }
    ]
  };

  return execute(request, ReturnsSchema);
};

export default analyze;
