import type { Meta, StoryObj } from "@storybook/react";
import SystemChatEvent from "./SystemChatEvent";

const meta: Meta<typeof SystemChatEvent> = {
  title: "Components/SystemChatEvent",
  component: SystemChatEvent
};

type Story = StoryObj<typeof SystemChatEvent>;

export const Default: Story = {
  args: {}
};

export default meta;
