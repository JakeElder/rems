import type { Meta, StoryObj } from "@storybook/react";
import BathroomsFilter from "./BathroomsFilter";

const meta: Meta<typeof BathroomsFilter> = {
  title: "Components/BathroomsFilter",
  component: BathroomsFilter
};

type Story = StoryObj<typeof BathroomsFilter>;

export const Default: Story = {
  args: {}
};

export default meta;
