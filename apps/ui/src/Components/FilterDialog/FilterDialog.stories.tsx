import type { Meta, StoryObj } from "@storybook/react";
import FilterDialog from "./FilterDialog";

const meta: Meta<typeof FilterDialog> = {
  title: "Components/FilterDialog",
  component: FilterDialog,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof FilterDialog>;

export const Default: Story = {
  args: {}
};

export default meta;
