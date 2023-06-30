import type { Meta, StoryObj } from "@storybook/react";
import TextInput from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Elements/TextInput",
  component: TextInput
};

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {}
};

export default meta;
