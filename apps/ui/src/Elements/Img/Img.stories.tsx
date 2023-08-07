import type { Meta, StoryObj } from "@storybook/react";
import Img from "./Img";

const meta: Meta<typeof Img> = {
  title: "Elements/Img",
  component: Img
};

type Story = StoryObj<typeof Img>;

export const Default: Story = {
  args: {}
};

export default meta;
