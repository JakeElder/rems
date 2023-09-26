import type { Meta, StoryObj } from "@storybook/react";
import * as Header from "./Header";
import ChatInput from "../ChatInput/ChatInput";
import { InputSession } from "@rems/types";
import { useEffect, useState } from "react";

type InputProps = React.ComponentProps<typeof ChatInput>;
type Props = Header.Props &
  Omit<InputProps, "state"> & { inputState: InputSession["state"] };
type Story = StoryObj<Props>;

export const Component = (props: Props) => {
  const [sessions, setSessions] = useState<InputSession[]>([
    {
      id: "one",
      value: "3 bedroom condos in Phuket",
      state: props.inputState
    }
  ]);

  useEffect(() => {
    setSessions((prev) => [
      ...prev.slice(0, -1),
      { ...prev[prev.length - 1], state: props.inputState }
    ]);
  }, [props.inputState]);

  return (
    <Header.Root {...props}>
      <Header.Main>
        <Header.Logo />
        <Header.ChatInput>
          <ChatInput
            {...props}
            theme="header"
            sessions={sessions}
            submittable={sessions[sessions.length - 1].value !== ""}
            onChange={(e) => {
              e.preventDefault();
              setSessions((prev) => [
                ...prev.slice(0, -1),
                { ...prev[prev.length - 1], value: e.target.value }
              ]);
            }}
          />
        </Header.ChatInput>
        <Header.NavAndContact />
      </Header.Main>
    </Header.Root>
  );
};

const meta: Meta<Props> = {
  title: "Components/Header",
  component: Component,
  parameters: {
    layout: "fullscreen"
  }
};

export const Default: Story = {
  args: {
    full: true,
    mode: "standard",
    inputState: "INACTIVE"
  }
};

export default meta;
