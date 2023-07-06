import type { Meta, StoryObj } from "@storybook/react";
import LotFeatureFilters from "./LotFeatureFilters";

const meta: Meta<typeof LotFeatureFilters> = {
  title: "Components/LotFeatureFilters",
  component: LotFeatureFilters
};

type Story = StoryObj<typeof LotFeatureFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
