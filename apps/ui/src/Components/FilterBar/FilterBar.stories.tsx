// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import FilterBar from "./FilterBar";

const meta: Meta<typeof FilterBar> = {
  title: "Components/FilterBar",
  component: FilterBar,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  args: {}
};

export default meta;
