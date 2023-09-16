import type { Meta, StoryObj } from "@storybook/react";
import ChatMessage from "./ChatMessage";

const meta: Meta<typeof ChatMessage> = {
  title: "Components/ChatMessage",
  component: ChatMessage
};

type Story = StoryObj<typeof ChatMessage>;

export const Default: Story = {
  args: {}
};

export default meta;
