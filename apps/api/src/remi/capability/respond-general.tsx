import {
  ChatCompletionRequest,
  RemiResponse,
  txt,
  execute,
  stringify
} from "@/remi";
import { AiCapability } from "@rems/schemas";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatCompletionRequestMessage } from "openai";
import { Z } from "@rems/types";

const { ArgsSchema, ReturnsSchema, ContextSchema } =
  AiCapability.RespondGeneral;

type Args = Z<typeof ArgsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;
type Fn = (args: Args) => Promise<RemiResponse<Returns>>;

const analyze: Fn = async (context) => {
  const schema = stringify(zodToJsonSchema(ContextSchema));
  const instruction: ChatCompletionRequestMessage["content"] = txt(
    <>
      <p>
        You are Remi, a Thai born, bi-lingual assistant responsible for helping
        the user of a real estate website.
      </p>
      <p>
        Sometimes the user may ask general questions, potentially not related to
        properties. It is your task to take the users input and respond. You
        should be polite and friendly with your response.
      </p>
      <p>Ensure you're responding to the most recent message</p>
      <p>Here is additional context: `{stringify<Context>(context)}`</p>
      <p>This is the schema of the context: `{schema}`</p>
    </>
  );

  const request: ChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: instruction }],
    function_call: { name: "f" },
    functions: [{ name: "f", parameters: zodToJsonSchema(ReturnsSchema) }]
  };

  return execute(request, ReturnsSchema);
};

export default analyze;
