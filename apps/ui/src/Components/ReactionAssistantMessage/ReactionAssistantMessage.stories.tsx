import type { Meta, StoryObj } from "@storybook/react";
import ReactionAssistantMessage from "./ReactionAssistantMessage";

const meta: Meta<typeof ReactionAssistantMessage> = {
  title: "Components/ReactionAssistantMessage",
  component: ReactionAssistantMessage
};

type Story = StoryObj<typeof ReactionAssistantMessage>;

export const Default: Story = {
  args: {}
};

export default meta;
