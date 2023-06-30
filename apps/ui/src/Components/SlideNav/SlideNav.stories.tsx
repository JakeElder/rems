import type { Meta, StoryObj } from "@storybook/react";
import SlideNav from "./SlideNav";
import { SpringValue } from "@react-spring/web";

const meta: Meta<typeof SlideNav> = {
  title: "Components/SlideNav",
  component: SlideNav,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof SlideNav>;

export const Default: Story = {
  args: {
    navIconColor: new SpringValue("#000"),
    defaultOpen: true
  }
};

export default meta;
