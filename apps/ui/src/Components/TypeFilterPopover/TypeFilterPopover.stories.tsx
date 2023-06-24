import type { Meta, StoryObj } from "@storybook/react";
import TypeFilterPopover from "./TypeFilterPopover";

const meta: Meta<typeof TypeFilterPopover> = {
  title: "Components/TypeFilterPopover",
  component: TypeFilterPopover,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof TypeFilterPopover>;

export const Default: Story = {
  args: {}
};

export default meta;
