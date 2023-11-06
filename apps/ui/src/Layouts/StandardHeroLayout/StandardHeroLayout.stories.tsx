// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import * as StandardHeroLayout from "./StandardHeroLayout";

const meta: Meta<typeof StandardHeroLayout> = {
  title: "Layouts/StandardHero",
  component: StandardHeroLayout,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof StandardHeroLayout>;

export const Default: Story = {
  args: {
    hero: <div style={{ background: "#eee" }} />,
    children: <span>stuff</span>
  }
};

export default meta;
