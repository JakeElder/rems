import type { Meta, StoryObj } from "@storybook/react";
import AreaFilter from "./AreaFilter";

const meta: Meta<typeof AreaFilter> = {
  title: "Components/AreaFilter",
  component: AreaFilter
};

type Story = StoryObj<typeof AreaFilter>;

export const Default: Story = {
  args: {}
};

export default meta;
