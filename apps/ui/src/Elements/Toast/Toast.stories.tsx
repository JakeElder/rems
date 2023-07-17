import type { Meta, StoryObj } from "@storybook/react";
import Toast from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Elements/Toast",
  component: Toast
};

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {}
};

export default meta;
