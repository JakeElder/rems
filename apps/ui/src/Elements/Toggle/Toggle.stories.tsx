import type { Meta, StoryObj } from "@storybook/react";
import Toggle from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Elements/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { children: "Toggle" }
};

export default meta;
