import React from "react";
import "the-new-css-reset";
import type { Preview } from "@storybook/react";
import FontLoader from "../src/Utils/FontLoader";
import IconLoader from "../src/Utils/IconLoader";
import "../src/fonts.css";

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
      <IconLoader>
        <Story />
      </IconLoader>
    )
  ]
};

export default preview;
