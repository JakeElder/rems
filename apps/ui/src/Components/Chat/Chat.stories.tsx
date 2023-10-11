import type { Meta, StoryObj } from "@storybook/react";
import * as Chat from "./Chat";
import React, { useEffect, useRef, useState } from "react";
import randomInt from "random-int";
import { InputSession, Timeline } from "@rems/types";
import mockTimeline from "../../fixtures/timeline";
import ChatInput from "../ChatInput/ChatInput";

type InputProps = React.ComponentProps<typeof ChatInput>;
type Props = Chat.Props &
  Omit<InputProps, "state"> & { inputState: InputSession["state"] };
type Story = StoryObj<Props>;

const next = (source: Timeline, current: Timeline): [Timeline, boolean] => {
  const e = source.shift();
  return [[...current, e!], source.length === 0];
};

export const Mock = (props: Props) => {
  const source = useRef([...mockTimeline]);
  const to = useRef<NodeJS.Timeout>();
  const [t, setCurrent] = useState(props.timeline);
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

  const push = (current: Timeline) => {
    const [nextTimeline, complete] = next(source.current, current);
    setCurrent(nextTimeline);
    if (!complete) {
      to.current = setTimeout(() => push(nextTimeline), randomInt(500, 2200));
    }
  };

  useEffect(() => {
    to.current = setTimeout(() => push(t), randomInt(500, 2200));
    () => {
      clearTimeout(to.current);
      source.current = [...mockTimeline];
      setCurrent([]);
    };
  }, []);

  return (
    <>
      <div>
        <div style={{ height: 90, background: "#a7a7a7" }}></div>
        <div style={{ minHeight: "calc(100vh - 90px)", display: "flex" }}>
          <div style={{ flex: 4, background: "#983434" }} />
          <div style={{ flex: 5 }} />
        </div>
      </div>
      <Chat.Root {...props}>
        <Chat.Dialog>
          <Chat.Header />
          <Chat.Body timeline={t} />
        </Chat.Dialog>
        <Chat.Input>
          <ChatInput
            {...props}
            sessions={sessions}
            submittable={sessions[sessions.length - 1].value !== ""}
            onChange={(e) => {
              e.preventDefault();
              setSessions((prev) => [
                ...prev.slice(0, -1),
                { ...prev[prev.length - 1], value: e.target.value }
              ]);
            }}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          />
        </Chat.Input>
      </Chat.Root>
    </>
  );
};

const meta: Meta<Props> = {
  title: "Chat/Chat",
  component: Mock,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" }
  }
};

export const Default: Story = {
  args: {
    lang: "en",
    state: "SLEEPING",
    uiState: "MINIMISED",
    inputState: "INACTIVE",
    timeline: [],
    submittable: false,
    theme: "chat"
  }
};

export default meta;
