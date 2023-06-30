import type { Meta, StoryObj } from "@storybook/react";
import ContactAgentModule from "./ContactAgentModule";

const meta: Meta<typeof ContactAgentModule> = {
  title: "Components/ContactAgentModule",
  component: ContactAgentModule,
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <div style={{ width: 340 }}>
        <Story />
      </div>
    )
  ]
};

type Story = StoryObj<typeof ContactAgentModule>;

export const Default: Story = {
  args: {}
};

export default meta;
