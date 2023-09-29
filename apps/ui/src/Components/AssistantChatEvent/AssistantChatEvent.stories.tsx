import type { Meta, StoryObj } from "@storybook/react";
import AssistantChatEvent from "./AssistantChatEvent";

const meta: Meta<typeof AssistantChatEvent> = {
  title: "Components/AssistantChatEvent",
  component: AssistantChatEvent
};

type Story = StoryObj<typeof AssistantChatEvent>;

export const Default: Story = {
  args: {}
};

export default meta;
