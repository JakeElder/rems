import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: { theme: "dark" }
};

export default meta;
