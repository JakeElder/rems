import type { Meta, StoryObj } from "@storybook/react";
import PlacesMessage from "./PlacesMessage";

const meta: Meta<typeof PlacesMessage> = {
  title: "Components/PlacesMessage",
  component: PlacesMessage
};

type Story = StoryObj<typeof PlacesMessage>;

export const Default: Story = {
  args: {}
};

export default meta;
