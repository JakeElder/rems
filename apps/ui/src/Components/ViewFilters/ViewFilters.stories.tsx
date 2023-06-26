import type { Meta, StoryObj } from "@storybook/react";
import ViewFilters from "./ViewFilters";

const meta: Meta<typeof ViewFilters> = {
  title: "Components/ViewFilters",
  component: ViewFilters,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof ViewFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
