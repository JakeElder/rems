import type { Meta, StoryObj } from "@storybook/react";
import LanguageBasedAssistantChatEvent from "./LanguageBasedAssistantChatEvent";

const meta: Meta<typeof LanguageBasedAssistantChatEvent> = {
  title: "Components/LanguageBasedAssistantChatEvent",
  component: LanguageBasedAssistantChatEvent
};

type Story = StoryObj<typeof LanguageBasedAssistantChatEvent>;

export const Default: Story = {
  args: {}
};

export default meta;
