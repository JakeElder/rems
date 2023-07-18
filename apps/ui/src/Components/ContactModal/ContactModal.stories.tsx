import type { Meta, StoryObj } from "@storybook/react";
import ContactModal from "./ContactModal";

const meta: Meta<typeof ContactModal> = {
  title: "Components/ContactModal",
  component: ContactModal
};

type Story = StoryObj<typeof ContactModal>;

export const Default: Story = {
  args: {}
};

export default meta;
