import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

export { Button };

const meta: Meta<React.ComponentProps<typeof Button>> = {
  title: "Elements/Button",
  component: Button,
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    )
  ]
};

type Story = StoryObj<React.ComponentProps<typeof Button>>;

export const Default: Story = {
  args: { children: "Primary" }
};

export const Secondary: Story = {
  args: { secondary: true, children: "Secondary" }
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" }
};

export const Loading: Story = {
  args: { loading: true }
};

export default meta;
