import type { Meta, StoryObj } from "@storybook/react";
import BedsFilter from "./BedsFilter";

const meta: Meta<typeof BedsFilter> = {
  title: "Components/BedsFilter",
  component: BedsFilter
};

type Story = StoryObj<typeof BedsFilter>;

export const Default: Story = {
  args: {}
};

export default meta;
