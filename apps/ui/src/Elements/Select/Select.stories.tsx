import type { Meta, StoryObj } from "@storybook/react";
import Select from "./Select";

const meta: Meta<typeof Select> = {
  title: "Elements/Select",
  component: Select,
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

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    defaultValue: "0",
    options: [
      { value: "0", label: "No Min" },
      { value: "20", label: "20 m²" },
      { value: "30", label: "30 m²" }
    ]
  }
};

export default meta;
