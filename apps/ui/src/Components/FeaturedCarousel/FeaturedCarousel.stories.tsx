// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import FeaturedCarousel from "./FeaturedCarousel";
import { Property } from "@rems/types";
import StoryPad from "../../Utils/StoryPad";

const meta: Meta<typeof FeaturedCarousel> = {
  title: "Components/FeaturedCarousel",
  component: FeaturedCarousel,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    (Story) => (
      <StoryPad>
        <Story />
      </StoryPad>
    )
  ]
};

type Story = StoryObj<typeof FeaturedCarousel>;

export const Default: Story = {
  args: {
    properties: properties as unknown as Property[]
  }
};

export default meta;
