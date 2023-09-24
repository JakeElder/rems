import type { Meta, StoryObj } from "@storybook/react";
import StateLabel from "./StateLabel";

const meta: Meta<typeof StateLabel> = {
  title: "Components/StateLabel",
  component: StateLabel
};

type Story = StoryObj<typeof StateLabel>;

export const Default: Story = {
  args: {}
};

export default meta;
