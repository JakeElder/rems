// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import Footer from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {}
};

export default meta;
