import type { Meta, StoryObj } from "@storybook/react";
import Container from "./Container";

const meta: Meta<typeof Container> = {
  title: "Elements/Container",
  component: Container,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {}
};

export default meta;
