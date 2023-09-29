import type { Meta, StoryObj } from "@storybook/react";
import UserChatEvent from "./UserChatEvent";

const meta: Meta<typeof UserChatEvent> = {
  title: "Components/UserChatEvent",
  component: UserChatEvent
};

type Story = StoryObj<typeof UserChatEvent>;

export const Default: Story = {
  args: {}
};

export default meta;
