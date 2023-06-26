import React from "react";
import "the-new-css-reset";
import type { Preview } from "@storybook/react";
import FontLoader from "../src/Utils/FontLoader";
import IconLoader from "../src/Utils/IconLoader";
import FiltersContext from "../src/Utils/FiltersContext";
import indoorFeatures from "../src/fixtures/indoor-features";
import lotFeatures from "../src/fixtures/lot-features";
import outdoorFeatures from "../src/fixtures/outdoor-features";
import propertyTypes from "../src/fixtures/property-types";
import viewTypes from "../src/fixtures/view-types";

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
      <FiltersContext
        value={{
          propertyTypes,
          indoorFeatures,
          lotFeatures,
          outdoorFeatures,
          viewTypes
        }}
      >
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
