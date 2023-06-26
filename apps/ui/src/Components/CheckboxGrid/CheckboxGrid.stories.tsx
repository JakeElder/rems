import type { Meta, StoryObj } from "@storybook/react";
import CheckboxGrid from "./CheckboxGrid";

const meta: Meta<typeof CheckboxGrid> = {
  title: "Components/CheckboxGrid",
  component: CheckboxGrid,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof CheckboxGrid>;

export const Default: Story = {
  args: {}
};

export default meta;
