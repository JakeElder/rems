import type { Meta, StoryObj } from "@storybook/react";
import MailingListModule from "./MailingListModule";
import Container from "../../Elements/Container";

const meta: Meta<typeof MailingListModule> = {
  title: "Components/MailingListModule",
  component: MailingListModule,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    )
  ]
};

type Story = StoryObj<typeof MailingListModule>;

export const Default: Story = {
  args: {}
};

export default meta;
