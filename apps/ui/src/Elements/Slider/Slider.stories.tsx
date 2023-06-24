import type { Meta, StoryObj } from "@storybook/react";
import Slider from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Elements/Slider",
  component: Slider,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    onValueChange: (n) => {
      console.log("change", n);
    },
    onValueCommit: (n) => {
      console.log("commit", n);
    },
    min: 0,
    max: 100_000_000,
    defaultValue: [0, 100_000_000],
    step: 1000
  }
};

export default meta;
