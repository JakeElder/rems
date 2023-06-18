import type { Meta, StoryObj } from "@storybook/react";
import Modal from "./Modal";
import { useState } from "react";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: { layout: "fullscreen" }
};

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          style={{ textDecoration: "underline" }}
          onClick={() => setOpen(true)}
        >
          Open
        </button>
        <Modal open={open} onCloseRequest={() => setOpen(false)}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            modal tings
          </div>
        </Modal>
      </div>
    );
  }
};

export default meta;
