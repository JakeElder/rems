import type { Meta, StoryObj } from "@storybook/react";
import HoldingPage from "./HoldingPage";

const meta: Meta<typeof HoldingPage> = {
  title: "Pages/HoldingPage",
  component: HoldingPage,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof HoldingPage>;

export const Default: Story = {
  args: {}
};

export default meta;
