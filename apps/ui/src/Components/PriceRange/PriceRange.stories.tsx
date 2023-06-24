import type { Meta, StoryObj } from "@storybook/react";
import PriceRange from "./PriceRange";

const meta: Meta<typeof PriceRange> = {
  title: "Components/PriceRange",
  component: PriceRange,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof PriceRange>;

export const Default: Story = {
  args: {}
};

export default meta;
