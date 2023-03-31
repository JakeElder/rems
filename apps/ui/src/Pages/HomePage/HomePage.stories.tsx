import type { Meta, StoryObj } from "@storybook/react";
import { Property } from "@rems/types";
import HomePage from "./HomePage";
import properties from "../../fixtures/properties.json";

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
    heroProperties: properties as unknown as Property[]
  }
};

export default meta;
