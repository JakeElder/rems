// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import * as Dialog from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog
};

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {}
};

export default meta;
