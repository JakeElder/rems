import React from "react";
import "the-new-css-reset";
import type { Preview } from "@storybook/react";
import FontLoader from "../src/Utils/FontLoader";
import IconLoader from "../src/Utils/IconLoader";
import FiltersContext from "../src/Utils/FiltersContext";
import propertyTypes from "../src/fixtures/property-types";

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
      <FiltersContext value={{ propertyTypes }}>
        <FontLoader>
          <IconLoader>
            <Story />
          </IconLoader>
        </FontLoader>
      </FiltersContext>
    )
  ]
};

export default preview;
