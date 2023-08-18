import { txt } from "../utils";
import { z } from "zod";

const InputSchema = z
  .string()
  .describe(
    txt(
      <>
        A natural language string taken from the end user. This is a command or
        request, issued by the user. Our task is to process this input and
        perform a specific task based on their intent.
      </>
    )
  );

export default InputSchema;
