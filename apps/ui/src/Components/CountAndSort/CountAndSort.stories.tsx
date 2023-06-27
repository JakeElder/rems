import type { Meta, StoryObj } from "@storybook/react";
import CountAndSort from "./CountAndSort";

const meta: Meta<typeof CountAndSort> = {
  title: "Components/CountAndSort",
  component: CountAndSort
};

type Story = StoryObj<typeof CountAndSort>;

export const Default: Story = {
  args: {}
};

export default meta;
