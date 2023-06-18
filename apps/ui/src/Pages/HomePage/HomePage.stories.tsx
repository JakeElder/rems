import type { Meta, StoryObj } from "@storybook/react";
import HomePage from "./HomePage";
import properties from "../../fixtures/properties";

const meta: Meta<typeof HomePage> = {
  title: "Pages/HomePage",
  component: HomePage,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof HomePage>;

export const Default: Story = {
  args: {
    heroProperties: properties
  }
};

export default meta;
