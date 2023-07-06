import type { Meta, StoryObj } from "@storybook/react";
import OutdoorFeatureFilters from "./OutdoorFeatureFilters";

const meta: Meta<typeof OutdoorFeatureFilters> = {
  title: "Components/OutdoorFeatureFilters",
  component: OutdoorFeatureFilters
};

type Story = StoryObj<typeof OutdoorFeatureFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
