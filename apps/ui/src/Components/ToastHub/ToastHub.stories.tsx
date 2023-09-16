import type { Meta, StoryObj } from "@storybook/react";
import ToastHub, { useToast } from "./ToastHub";
import Button from "../../Elements/Button";

const meta: Meta<typeof ToastHub> = {
  title: "Components/ToastHub",
  component: ToastHub
};

type Story = StoryObj<typeof ToastHub>;

function SomeComponent() {
  const toast = useToast();

  return (
    <div style={{ width: 140 }}>
      <Button
        onClick={() => {
          toast.message({
            title: "Email Submitted",
            message:
              "One of our agents will get back to you as soon as possible."
          });
        }}
      >
        Add Toast
      </Button>
    </div>
  );
}

export const Default: Story = {
  render() {
    return (
      <ToastHub>
        <SomeComponent />
      </ToastHub>
    );
  }
};

export default meta;
