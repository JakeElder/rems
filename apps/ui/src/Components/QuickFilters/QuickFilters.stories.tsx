import type { Meta, StoryObj } from "@storybook/react";
import QuickFilters from "./QuickFilters";

const meta: Meta<typeof QuickFilters> = {
  title: "Components/QuickFilters",
  component: QuickFilters
};

type Story = StoryObj<typeof QuickFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
