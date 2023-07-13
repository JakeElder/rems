import type { Meta, StoryObj } from "@storybook/react";
import LotSizeFilters from "./LotSizeFilters";

const meta: Meta<typeof LotSizeFilters> = {
  title: "Components/LotSizeFilters",
  component: LotSizeFilters
};

type Story = StoryObj<typeof LotSizeFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
