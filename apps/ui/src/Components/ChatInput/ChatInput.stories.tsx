import type { Meta, StoryObj } from "@storybook/react";
import ChatInput from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "Components/ChatInput",
  component: ChatInput
};

type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  args: {}
};

export default meta;
