import type { Meta, StoryObj } from "@storybook/react";
import IndoorFeatureFilters from "./IndoorFeatureFilters";

const meta: Meta<typeof IndoorFeatureFilters> = {
  title: "Components/IndoorFeatureFilters",
  component: IndoorFeatureFilters
};

type Story = StoryObj<typeof IndoorFeatureFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
