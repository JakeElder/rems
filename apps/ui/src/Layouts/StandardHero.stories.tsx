import type { Meta, StoryObj } from "@storybook/react";
import StandardHero from "./StandardHero";

const meta: Meta<typeof StandardHero> = {
  title: "Layouts/StandardHero",
  component: StandardHero,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof StandardHero>;

export const Default: Story = {
  args: {
    hero: <div style={{ background: "#eee" }} />,
    children: <span>stuff</span>
  }
};

export default meta;
