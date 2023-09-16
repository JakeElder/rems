import type { Meta, StoryObj } from "@storybook/react";
import LanguageBasedUserMessage from "./LanguageBasedUserMessage";

const meta: Meta<typeof LanguageBasedUserMessage> = {
  title: "Components/LanguageBasedUserMessage",
  component: LanguageBasedUserMessage
};

type Story = StoryObj<typeof LanguageBasedUserMessage>;

export const Default: Story = {
  args: {}
};

export default meta;
