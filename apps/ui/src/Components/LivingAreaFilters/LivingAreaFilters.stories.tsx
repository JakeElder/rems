import type { Meta, StoryObj } from "@storybook/react";
import LivingAreaFilters from "./LivingAreaFilters";

const meta: Meta<typeof LivingAreaFilters> = {
  title: "Components/LivingAreaFilters",
  component: LivingAreaFilters
};

type Story = StoryObj<typeof LivingAreaFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
