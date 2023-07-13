import type { Meta, StoryObj } from "@storybook/react";
import IndexConnector from "./IndexConnector";

const meta: Meta<typeof IndexConnector> = {
  title: "Components/IndexConnector",
  component: IndexConnector
};

type Story = StoryObj<typeof IndexConnector>;

export const Default: Story = {
  args: {}
};

export default meta;
