import type { Meta, StoryObj } from "@storybook/react";
import BedsFilterPopover from "./BedsFilterPopover";

const meta: Meta<typeof BedsFilterPopover> = {
  title: "Components/BedsFilterPopover",
  component: BedsFilterPopover,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof BedsFilterPopover>;

export const Default: Story = {
  args: {}
};

export default meta;
