import type { Meta, StoryObj } from "@storybook/react";
import TextInput from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Elements/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    )
  ]
};

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {}
};

export default meta;
