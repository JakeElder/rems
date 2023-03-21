import React from "react";
import "the-new-css-reset";
import type { Preview } from "@storybook/react";
import FontLoader from "../src/Utils/FontLoader";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },
  decorators: [
    (Story) => (
      <FontLoader>
        <div style={{ maxWidth: 360, margin: "auto", overflow: "hidden" }}>
          <Story />
        </div>
      </FontLoader>
    )
  ]
};

export default preview;
