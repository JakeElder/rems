import type { Meta, StoryObj } from "@storybook/react";
import AvailabilityFilter from "./AvailabilityFilter";

const meta: Meta<typeof AvailabilityFilter> = {
  title: "Components/AvailabilityFilter",
  component: AvailabilityFilter
};

type Story = StoryObj<typeof AvailabilityFilter>;

export const Default: Story = {
  args: {}
};

export default meta;
