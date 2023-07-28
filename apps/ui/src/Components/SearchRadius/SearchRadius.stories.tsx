import type { Meta, StoryObj } from "@storybook/react";
import SearchRadius from "./SearchRadius";

const meta: Meta<typeof SearchRadius> = {
  title: "Components/SearchRadius",
  component: SearchRadius
};

type Story = StoryObj<typeof SearchRadius>;

export const Default: Story = {
  args: {}
};

export default meta;
