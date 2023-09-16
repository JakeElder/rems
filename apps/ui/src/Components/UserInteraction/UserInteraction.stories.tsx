import type { Meta, StoryObj } from "@storybook/react";
import UserInteraction from "./UserInteraction";

const meta: Meta<typeof UserInteraction> = {
  title: "Components/UserInteraction",
  component: UserInteraction
};

type Story = StoryObj<typeof UserInteraction>;

export const Default: Story = {
  args: {}
};

export default meta;
