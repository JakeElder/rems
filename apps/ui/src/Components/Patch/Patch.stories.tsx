import type { Meta, StoryObj } from "@storybook/react";
import Patch from "./Patch";

const meta: Meta<typeof Patch> = {
  title: "Components/Patch",
  component: Patch
};

type Story = StoryObj<typeof Patch>;

export const Default: Story = {
  args: {}
};

export default meta;
