import type { Meta, StoryObj } from "@storybook/react";
import NavModal from "./NavModal";
import HomePage from "../../Pages/HomePage/HomePage";
import properties from "../../fixtures/properties";

const meta: Meta<typeof NavModal> = {
  title: "Components/NavModal",
  component: NavModal,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof NavModal>;

export const Default: Story = {
  render: () => {
    return (
      <div>
        <NavModal open={true} />
        <HomePage heroProperties={properties} />
      </div>
    );
  }
};

export default meta;
