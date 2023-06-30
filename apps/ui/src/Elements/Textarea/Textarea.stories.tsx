import type { Meta, StoryObj } from "@storybook/react";
import Textarea from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Elements/Textarea",
  component: Textarea
};

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {}
};

export default meta;
