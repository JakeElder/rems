import type { Meta, StoryObj } from "@storybook/react";
import LanguageBasedUserChatEvent from "./LanguageBasedUserChatEvent";

const meta: Meta<typeof LanguageBasedUserChatEvent> = {
  title: "Components/LanguageBasedUserChatEvent",
  component: LanguageBasedUserChatEvent
};

type Story = StoryObj<typeof LanguageBasedUserChatEvent>;

export const Default: Story = {
  args: {}
};

export default meta;
