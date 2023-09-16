import type { Meta, StoryObj } from "@storybook/react";
import AssistantMessage from "./AssistantMessage";

const meta: Meta<typeof AssistantMessage> = {
  title: "Components/AssistantMessage",
  component: AssistantMessage
};

type Story = StoryObj<typeof AssistantMessage>;

export const Default: Story = {
  args: {}
};

export default meta;
