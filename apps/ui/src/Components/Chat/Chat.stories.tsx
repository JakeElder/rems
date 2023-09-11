import type { Meta, StoryObj } from "@storybook/react";
import Chat from "./Chat";

const meta: Meta<typeof Chat> = {
  title: "Components/Chat",
  component: Chat
};

type Story = StoryObj<typeof Chat>;

export const Default: Story = {
  args: {}
};

export default meta;
