import type { Meta, StoryObj } from "@storybook/react";
import ViewTypeFilters from "./ViewTypeFilters";

const meta: Meta<typeof ViewTypeFilters> = {
  title: "Components/ViewTypeFilters",
  component: ViewTypeFilters
};

type Story = StoryObj<typeof ViewTypeFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
