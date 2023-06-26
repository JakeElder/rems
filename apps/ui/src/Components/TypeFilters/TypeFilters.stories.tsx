import type { Meta, StoryObj } from "@storybook/react";
import TypeFilters from "./TypeFilters";

const meta: Meta<typeof TypeFilters> = {
  title: "Components/TypeFilters",
  component: TypeFilters,
};

type Story = StoryObj<typeof TypeFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
