import type { Meta, StoryObj } from "@storybook/react";
import EnterIcon from "./EnterIcon";

const meta: Meta<typeof EnterIcon> = {
  title: "Elements/EnterIcon",
  component: EnterIcon
};

type Story = StoryObj<typeof EnterIcon>;

export const Default: Story = {
  args: {}
};

export default meta;
