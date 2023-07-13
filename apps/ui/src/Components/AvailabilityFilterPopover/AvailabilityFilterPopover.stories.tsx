import type { Meta, StoryObj } from "@storybook/react";
import AvailabilityFilterPopover from "./AvailabilityFilterPopover";

const meta: Meta<typeof AvailabilityFilterPopover> = {
  title: "Components/AvailabilityFilterPopover",
  component: AvailabilityFilterPopover
};

type Story = StoryObj<typeof AvailabilityFilterPopover>;

export const Default: Story = {
  args: {}
};

export default meta;
