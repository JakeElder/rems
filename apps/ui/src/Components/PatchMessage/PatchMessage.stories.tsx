import type { Meta, StoryObj } from "@storybook/react";
import PatchMessage from "./PatchMessage";

const meta: Meta<typeof PatchMessage> = {
  title: "Components/PatchMessage",
  component: PatchMessage
};

type Story = StoryObj<typeof PatchMessage>;

export const Default: Story = {
  args: {}
};

export default meta;
