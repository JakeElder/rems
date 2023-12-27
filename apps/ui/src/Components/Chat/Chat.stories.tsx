import { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as Chat from "./Chat";
import React, { useEffect, useRef, useState } from "react";
import { InputSession, Timeline } from "@rems/types";
import ChatInput from "../ChatInput/ChatInput";
import mockTimeline from "../../fixtures/timeline";
import { randomInt } from "@rems/utils";
import {
  AssistantModeSchema,
  AssistantPlacementSchema,
  InputSessionState
} from "@rems/schemas";

type InputProps = React.ComponentProps<typeof ChatInput>;
type Props = Chat.Props &
  Omit<InputProps, "state"> & { inputState: InputSession["state"] };

// const next = (source: Timeline, current: Timeline): [Timeline, boolean] => {
//   const e = source.shift();
//   return [[...current, e!], source.length === 0];
// };

export const Mock: FC<Props> = (props) => {
  // const source = useRef([...mockTimeline]);
  // const to = useRef<NodeJS.Timeout>();
  // const [t, setCurrent] = useState(props.timeline);

  const $left = useRef<HTMLDivElement | null>(null);
  const $top = useRef<HTMLDivElement | null>(null);
  const spacing = Chat.useAssistantSpacingUtility({ $left, $top });

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

  // const push = (current: Timeline) => {
  //   const [nextTimeline, complete] = next(source.current, current);
  //   setCurrent(nextTimeline);
  //   if (!complete) {
  //     to.current = setTimeout(() => push(nextTimeline), randomInt(500, 2200));
  //   }
  // };

  // useEffect(() => {
  //   to.current = setTimeout(() => push(t), randomInt(500, 2200));
  //   () => {
  //     clearTimeout(to.current);
  //     source.current = [...mockTimeline];
  //     setCurrent([]);
  //   };
  // }, []);

  return (
    <>
      <div>
        <div ref={$top} style={{ height: 90, background: "#a7a7a7" }}></div>
        <div style={{ minHeight: "calc(100vh - 90px)", display: "flex" }}>
          <div ref={$left} style={{ flex: 4, background: "#983434" }} />
          <div style={{ flex: 5 }} />
        </div>
      </div>
      {!spacing.ready ? null : (
        <Chat.Root {...props} {...spacing.props}>
          <Chat.Dialog>
            <Chat.Header {...props} />
            <Chat.Body timeline={props.timeline} />
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
          <Chat.Branding />
        </Chat.Root>
      )}
    </>
  );
};

const meta = {
  title: "Chat/Chat",
  component: Mock,
  argTypes: {
    mode: {
      options: AssistantModeSchema.options,
      control: { type: "radio" }
    },
    placement: {
      options: AssistantPlacementSchema.options,
      control: { type: "radio" }
    },
    inputState: {
      options: InputSessionState.options,
      control: { type: "radio" }
    }
  },
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" }
  }
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    lang: "EN",
    mode: "SLEEPING",
    placement: "WINDOWED",
    inputState: "INACTIVE",
    timeline: mockTimeline,
    submittable: false,
    theme: "chat"
  }
};

export default meta;
