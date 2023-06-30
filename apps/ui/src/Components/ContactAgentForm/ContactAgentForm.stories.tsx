import type { Meta, StoryObj } from "@storybook/react";
import ContactAgentForm from "./ContactAgentForm";

const meta: Meta<typeof ContactAgentForm> = {
  title: "Components/ContactAgentForm",
  component: ContactAgentForm
};

type Story = StoryObj<typeof ContactAgentForm>;

export const Default: Story = {
  args: {}
};

export default meta;
