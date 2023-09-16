import type { Meta, StoryObj } from "@storybook/react";
import LanguageBasedAssistantMessage from "./LanguageBasedAssistantMessage";

const meta: Meta<typeof LanguageBasedAssistantMessage> = {
  title: "Components/LanguageBasedAssistantMessage",
  component: LanguageBasedAssistantMessage
};

type Story = StoryObj<typeof LanguageBasedAssistantMessage>;

export const Default: Story = {
  args: {}
};

export default meta;
