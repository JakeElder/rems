import type { Meta, StoryObj } from "@storybook/react";
import Monogram from "./Monogram";

const meta: Meta<typeof Monogram> = {
  title: "Elements/Monogram",
  component: Monogram
};

type Story = StoryObj<typeof Monogram>;

export const Default: Story = {
  args: {}
};

export default meta;
