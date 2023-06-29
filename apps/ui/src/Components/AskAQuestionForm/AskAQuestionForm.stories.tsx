import type { Meta, StoryObj } from "@storybook/react";
import AskAQuestionForm from "./AskAQuestionForm";

const meta: Meta<typeof AskAQuestionForm> = {
  title: "Components/AskAQuestionForm",
  component: AskAQuestionForm
};

type Story = StoryObj<typeof AskAQuestionForm>;

export const Default: Story = {
  args: {}
};

export default meta;
