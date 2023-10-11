"use client";

import React, { createContext, useMemo } from "react";
import css from "./Chat.module.css";
import {
  AssistantState,
  AssistantUiState,
  MakeNonNullable,
  Timeline,
  TimelineEvent
} from "@rems/types";
import avatar from "../../assets/avatar.png";
import ror from "../../assets/ror.png";
import { Pick, animated, useSpring, useTransition } from "@react-spring/web";
import ChatMessage from "../ChatMessage";
import equal from "fast-deep-equal";
import { CHAT_PALETTE } from "../../colors";
import StateLabel from "../StateLabel/StateLabel";
import useAssistantUiLayout from "../../hooks/use-assistant-ui-layout";
import { assistantStateToGroupedAssistantState } from "../../adapters";

type ContextProps = {
  lang: "en" | "th";
  state: AssistantState;
};

export type Props = {
  timeline: Timeline;
  uiState: AssistantUiState;
  xDivide: number | null;
  marginTop: number | null;
} & ContextProps;

const Context = createContext<ContextProps | null>(null);
const useContext = () => React.useContext(Context)!;

export const Header = () => {
  const { state, lang } = useContext();

  const group = assistantStateToGroupedAssistantState(state);

  const { avatarBorder } = useSpring(CHAT_PALETTE[group]);
  const { avatarOpacity } = useSpring({
    avatarOpacity: state === "SLEEPING" ? 0.7 : 0.8
  });

  return (
    <div className={css["header"]}>
      <div className={css["avatar-name-state"]}>
        <animated.div
          className={css["avatar"]}
          style={{ borderColor: avatarBorder }}
        >
          <div className={css["avatar-inner"]}>
            <animated.img
              className={css["remi"]}
              src={avatar.src}
              style={{ opacity: avatarOpacity }}
            />
            <div className={css["ror"]}>
              <img
                src={ror.src}
                width={ror.width / 2}
                height={ror.height / 2}
              />
            </div>
            <div className={css["shadow"]} />
          </div>
        </animated.div>
        <div className={css["name"]}>Remi</div>
        <StateLabel state={state} />
      </div>
      <div className={css["lang-manage-ui-state"]}>
        <div className={css["lang"]}>{lang}</div>
      </div>
    </div>
  );
};

const isLanguageBasedUserMessageEvent = (e: TimelineEvent) =>
  e.type === "USER" &&
  (e.interaction.type === "VERBAL" || e.interaction.type === "WRITTEN");

const isLanguageBasedAssistantMessageEvent = (e: TimelineEvent) =>
  e.type === "ASSISTANT" &&
  e.message.type === "REACTION" &&
  e.message.reaction.type === "LANGUAGE_BASED";

const isLanguageBasedEvent = (e: TimelineEvent) =>
  isLanguageBasedUserMessageEvent(e) || isLanguageBasedAssistantMessageEvent(e);

const isPatchEvent = (e: TimelineEvent) =>
  e.type === "ASSISTANT" &&
  e.message.type === "REACTION" &&
  e.message.reaction.type === "PATCH";

const isEmptyPatchEvent = (e: TimelineEvent) => {
  if (
    e.type === "ASSISTANT" &&
    e.message.type === "REACTION" &&
    e.message.reaction.type === "PATCH"
  ) {
    if (
      e.message.reaction.patch.type === "SCALAR" &&
      Object.keys(e.message.reaction.patch.data).length === 0
    ) {
      return true;
    }
    if (
      e.message.reaction.patch.type === "ARRAY" &&
      e.message.reaction.patch.diff.length === 0 &&
      e.message.reaction.patch.value.length === 0
    ) {
      return true;
    }
  }
  return false;
};

export const Dialog = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["dialog"]}>{children}</div>;
};

export const Input = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["input"]}>{children}</div>;
};

export const Body = React.memo(
  ({ timeline }: Pick<Props, "timeline">) => {
    const refMap = useMemo(() => new WeakMap(), []);

    const events = timeline
      .slice()
      .reverse()
      .filter((e) => {
        if (isEmptyPatchEvent(e)) {
          return false;
        }

        if (isLanguageBasedEvent(e) || isPatchEvent(e)) {
          return true;
        }

        return false;
      });

    const transitions = useTransition(events, {
      keys: (item) => item.id,
      from: { opacity: 0, height: 0 },
      enter: (item) => async (next) => {
        const $el = refMap.get(item);
        await next({ opacity: 1, height: $el.offsetHeight });
      }
    });

    return (
      <div className={css["body"]}>
        <div className={css["shadow"]} />
        <div className={css["timeline"]}>
          {transitions((style, e) => {
            return (
              <animated.div style={style} key={e.id}>
                <ChatMessage
                  key={e.id}
                  {...e}
                  ref={(ref: HTMLDivElement) => ref && refMap.set(e, ref)}
                />
              </animated.div>
            );
          })}
        </div>
      </div>
    );
  },
  (prev, next) => equal(prev.timeline, next.timeline)
);

export const Root = ({
  marginTop,
  xDivide,
  ...props
}: { children: React.ReactNode } & Props) => {
  if (marginTop !== null && xDivide !== null) {
    return <ReadyRoot {...props} marginTop={marginTop} xDivide={xDivide} />;
  }
  return null;
};

export const ReadyRoot = ({
  children,
  uiState,
  state,
  xDivide,
  marginTop,
  lang
}: { children: React.ReactNode } & MakeNonNullable<
  Props,
  "xDivide" | "marginTop"
>) => {
  const {
    padding,
    borderRadius,
    boxShadow,
    backdropFilter,
    background,
    left,
    top,
    right,
    bottom
  } = useAssistantUiLayout({
    state: uiState,
    assistantState: state,
    xDivide,
    marginTop
  });

  return (
    <Context.Provider value={{ lang, state }}>
      <animated.div
        className={css["root"]}
        style={{ left, top, right, bottom }}
      >
        <animated.div
          className={css["background"]}
          style={{
            borderRadius,
            boxShadow,
            backdropFilter,
            background
          }}
        />
        <animated.div className={css["foreground"]} style={{ padding }}>
          {children}
        </animated.div>
      </animated.div>
    </Context.Provider>
  );
};
