import { z } from "zod";
import { NodeHtmlMarkdown } from "node-html-markdown";

export const txt = (node: React.ReactNode) => {
  const { renderToStaticMarkup } = require("react-dom/server");
  return NodeHtmlMarkdown.translate(renderToStaticMarkup(node));
};

export const CapabilitySchema = z
  .enum(["NQ", "RQ", "CQ", "OP", "RB", "RGQ"])
  .describe(
    txt(
      <>
        <p>
          The type of action that should be performed based on the users natural
          language input. The value should be one of the following;
        </p>
        <ul>
          <li>
            `NQ` (new query): The user has issued a command that implies they
            would wish to begin a new search. EG "Show me properties in
            (location)"
          </li>
          <li>
            `RQ` (refine query): The user has issued a command that implies they
            would like to continue exploring the current set of properties, but
            with additional or amended search critera. EG "It has to have a bar"
          </li>
          <li>
            `CQ` (clear query): The user has issued a command that implies they
            would like to abandon their current search, and have the listing
            page be back at it's default settings.
          </li>
          <li>
            `OP` (open property): The user has issued a command that implies
            they have identified a property in and they would like to see more
            details. EG "Show me $NL_THAT_SOUNDS_LIKE_A_PROPERTY_DESCRIPTION".
            They may request to see details by number, or by the properties
            title.
          </li>
          <li>
            `RV` (request viewing): The user has identified a property they
            would like to see, and would like to book a viewing. EG "Ok, book a
            viewing"
          </li>
          <li>
            `RGQ` (respond to general question): Sometimes the user will just
            ask a general question. Not necessarily even related to properties.
            EG: "What's the capital of France". Commands like this will start
            with something like "do you know", or "is it possible", etc.
          </li>
        </ul>
      </>
    )
  );
