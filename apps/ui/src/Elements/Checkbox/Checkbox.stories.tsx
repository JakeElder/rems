import type { Meta, StoryObj } from "@storybook/react";
import Checkbox from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Elements/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    id: "apartment",
    label: "Apartment"
  }
};

export default meta;
