// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import * as ContactForm from "./ContactForm";

const meta: Meta<typeof ContactForm> = {
  title: "Components/ContactForm",
  component: ContactForm
};

type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {
  args: {}
};

export default meta;
