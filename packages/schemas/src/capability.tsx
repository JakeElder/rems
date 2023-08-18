import { z } from "zod";
import { NodeHtmlMarkdown } from "node-html-markdown";

export const txt = (node: React.ReactNode) => {
  const { renderToStaticMarkup } = require("react-dom/server");
  return NodeHtmlMarkdown.translate(renderToStaticMarkup(node));
};

export const CapabilitySchema = z.object({
  name: z.string(),
  code: z
    .string()
    .describe(txt(<>A short unique identifier for the capability</>)),
  description: z
    .string()
    .describe(
      txt(
        <>
          A description of the capability, worded in a way that acts as
          documentation for someone that Remi is assisting. IE, the description
          describes to an end user how this capability can be utilised.
        </>
      )
    ),
  exampleTriggers: z
    .array(z.string())
    .describe(
      txt(
        <>
          Remi is a virtual assistant, that takes users input, processes their
          request and then performs the best suited capability in order to serve
          the user. This is a natural language array of strings that when issued
          by the user should trigger this capability.
        </>
      )
    )
});
