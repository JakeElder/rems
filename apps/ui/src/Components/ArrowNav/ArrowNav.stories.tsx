import type { Meta, StoryObj } from "@storybook/react";
import ArrowNav from "./ArrowNav";

const meta: Meta<typeof ArrowNav> = {
  title: "Components/ArrowNav",
  component: ArrowNav
};

type Story = StoryObj<typeof ArrowNav>;

export const Default: Story = {
  render() {
    return <ArrowNav hasNext={true} hasPrev={true} />;
  }
};

export default meta;
