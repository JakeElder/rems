import type { Meta, StoryObj } from "@storybook/react";
import MailingListModule from "./MailingListModule";

const meta: Meta<typeof MailingListModule> = {
  title: "Components/MailingListModule",
  component: MailingListModule
};

type Story = StoryObj<typeof MailingListModule>;

export const Default: Story = {
  args: {}
};

export default meta;
