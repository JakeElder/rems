import type { Meta, StoryObj } from "@storybook/react";
import Breadcrumbs from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs
};

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {}
};

export default meta;
