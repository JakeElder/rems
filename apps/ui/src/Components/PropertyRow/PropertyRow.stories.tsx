import type { Meta, StoryObj } from "@storybook/react";
import PropertyRow from "./PropertyRow";

const meta: Meta<typeof PropertyRow> = {
  title: "Components/PropertyRow",
  component: PropertyRow
};

type Story = StoryObj<typeof PropertyRow>;

export const Default: Story = {
  args: {}
};

export default meta;
