import type { Meta, StoryObj } from "@storybook/react";
import ToggleGroup from "./ToggleGroup";

const meta: Meta<typeof ToggleGroup> = {
  title: "Components/ToggleGroup",
  component: ToggleGroup,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  args: {
    items: [
      { label: "1", value: "one" },
      { label: "2", value: "two" },
      { label: "3", value: "three" }
    ]
  }
};

export default meta;
