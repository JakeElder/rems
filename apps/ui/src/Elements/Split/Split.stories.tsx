import type { Meta, StoryObj } from "@storybook/react";
import Split from "./Split";

const meta: Meta<typeof Split> = {
  title: "Elements/Split",
  component: Split,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof Split>;

export const Default: Story = {
  args: {}
};

export default meta;
