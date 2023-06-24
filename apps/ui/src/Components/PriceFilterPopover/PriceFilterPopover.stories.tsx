import type { Meta, StoryObj } from "@storybook/react";
import PriceFilterPopover from "./PriceFilterPopover";

const meta: Meta<typeof PriceFilterPopover> = {
  title: "Components/PriceFilterPopover",
  component: PriceFilterPopover,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof PriceFilterPopover>;

export const Default: Story = {
  args: {}
};

export default meta;
