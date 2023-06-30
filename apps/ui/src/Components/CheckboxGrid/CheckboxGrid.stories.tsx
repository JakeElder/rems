import type { Meta, StoryObj } from "@storybook/react";
import CheckboxGrid from "./CheckboxGrid";
import Checkbox from "src/Elements/Checkbox/Checkbox";

const meta: Meta<typeof CheckboxGrid> = {
  title: "Components/CheckboxGrid",
  component: CheckboxGrid,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof CheckboxGrid>;

export const Default: Story = {
  args: {
    items: [
      <Checkbox id="apartment" label="Apartment" />,
      <Checkbox id="condo" label="Condo" />
    ]
  }
};

export default meta;
