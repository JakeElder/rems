import type { Meta, StoryObj } from "@storybook/react";
import Outline from "./Outline";

const meta: Meta<typeof Outline> = {
  title: "Elements/Outline",
  component: Outline
};

type Story = StoryObj<typeof Outline>;

export const Default: Story = {
  args: {}
};

export default meta;
