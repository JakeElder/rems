"use client";

import React, { useMemo, MutableRefObject, useEffect, useState } from "react";
import css from "./Chat.module.css";
import {
  AssistantMode,
  AssistantState,
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

export type Spacing = {
  xDivide: number;
  marginTop: number;
};

export type SpacingUtilityReturn =
  | { ready: false }
  | { ready: true; props: Spacing };

export type Props = {
  children: React.ReactNode;
  lang: "EN" | "TH";
  mode: AssistantMode;
  timeline: Timeline;
  placement: AssistantState["placement"];
} & Spacing;

type PulseAnimationState = {
  transform: string;
  opacity: number;
};

type PulseAnimation = {
  from: PulseAnimationState;
  to: PulseAnimationState;
};

const LISTENING_ANIMATION: PulseAnimation = {
  from: { transform: "scale(1.3)", opacity: 0 },
  to: { transform: "scale(1)", opacity: 0.5 }
};

const WORKING_ANIMATION: PulseAnimation = {
  from: { transform: "scale(1)", opacity: 1 },
  to: { transform: "scale(1.2)", opacity: 0 }
};

const DEFAULT_ANIMATION = LISTENING_ANIMATION;

const pulseAnimation = (mode: Props["mode"]) => {
  if (mode === "LISTENING") return LISTENING_ANIMATION;
  if (mode === "WORKING") return WORKING_ANIMATION;
  return DEFAULT_ANIMATION;
};

export const Header = React.memo(
  ({ mode, lang }: Pick<Props, "mode" | "lang">) => {
    const palette = CHAT_PALETTE[mode];

    const { avatarBorder } = useSpring(palette);
    const { avatarOpacity } = useSpring({
      avatarOpacity: mode === "SLEEPING" ? 0.7 : 0.8
    });

    const pulseStyle = useSpring({
      ...pulseAnimation(mode),
      reset: true,
      loop: true,
      config: { tension: 170, friction: 50 }
    });

    const { pulseOpacity } = useSpring({
      pulseOpacity: mode === "LISTENING" || mode === "WORKING" ? 1 : 0
    });

    const langStyle = useSpring({
      y: lang === "EN" ? 0 : -14,
      enOpacity: lang === "EN" ? 1 : 0,
      thOpacity: lang === "TH" ? 1 : 0
    });

    return (
      <div className={css["header"]}>
        <div className={css["avatar-name-state"]}>
          <animated.div
            className={css["avatar"]}
            style={{ borderColor: avatarBorder }}
          >
            <animated.span style={{ opacity: pulseOpacity }}>
              <animated.div
                className={css["avatar-ring"]}
                style={{ ...pulseStyle, borderColor: palette.avatarBorder }}
              />
            </animated.span>
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
          <StateLabel mode={mode} />
        </div>
        <div className={css["lang-manage-ui-state"]}>
          <div className={css["lang"]}>
            <animated.span
              className={css["en"]}
              style={{ y: langStyle.y, opacity: langStyle.enOpacity }}
            >
              EN
            </animated.span>
            <animated.span
              className={css["th"]}
              style={{ y: langStyle.y, opacity: langStyle.thOpacity }}
            >
              TH
            </animated.span>
          </div>
        </div>
      </div>
    );
  },
  (prev, next) => {
    return prev.mode === next.mode && prev.lang === next.lang;
  }
);

const isLanguageBasedEvent = (e: TimelineEvent) => e.event.type === "YIELD";

const isPatchEvent = (e: TimelineEvent) => e.event.type === "STATE_MUTATION";

const isNearbyPlacesEstablishedEvent = (e: TimelineEvent) =>
  e.event.type === "NEARBY_PLACES_ESTABLISHED";

const isEmptyPatchEvent = ({ role, event: e }: TimelineEvent) => {
  if (role === "ASSISTANT" && e.type === "STATE_MUTATION") {
    if (
      e.mutation.patch.type === "SCALAR" &&
      Object.keys(e.mutation.patch.data).length === 0
    ) {
      return true;
    }
    if (
      e.mutation.patch.type === "ARRAY" &&
      e.mutation.patch.diff.length === 0 &&
      e.mutation.patch.value.length === 0
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

export const Branding = ({ mode }: { mode: AssistantMode }) => {
  const style = useSpring({
    fill: mode === "SLEEPING" ? "#000" : "#fff",
    color: mode === "SLEEPING" ? "#444" : "#fff"
  });

  return (
    <animated.div className={css["branding"]} style={style}>
      <span className={css["powered-by"]}>powered by</span>
      <div className={css["logo"]}>
        <svg width={24.945} height={9.36}>
          <path d="m3.3 7.695 1.125-1.47C5.31 5.04 6.09 3.945 6.09 2.73 6.09 1.065 4.95 0 3.165 0 1.98 0 .9.48.24 1.095V2.97c.615-.57 1.575-1.2 2.58-1.2.87 0 1.335.48 1.335 1.2 0 .96-.615 1.71-1.47 2.82L0 9.3v.06h6.3V7.695h-3ZM11.31 6.165c1.95 0 3.24-1.05 3.24-3C14.55 1.2 13.26.15 11.31.15H7.56v9.21h1.905V6.165h1.845Zm1.35-3c0 .795-.48 1.365-1.47 1.365H9.465V1.785h1.725c.99 0 1.47.555 1.47 1.38ZM20.43 7.38l2.625-3.96v5.94h1.89V.15H23.19L20.415 4.5 17.625.15H15.84v9.21h1.875V3.42l2.655 3.96z" />
        </svg>
      </div>
    </animated.div>
  );
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

        if (
          isLanguageBasedEvent(e) ||
          isPatchEvent(e) ||
          isNearbyPlacesEstablishedEvent(e)
        ) {
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

export const useAssistantSpacingUtility = ({
  $top,
  $left
}: {
  $top: MutableRefObject<HTMLDivElement | null>;
  $left: MutableRefObject<HTMLDivElement | null>;
}): SpacingUtilityReturn => {
  const [spacing, setSpacing] = useState<Spacing | null>(null);

  useEffect(() => {
    if ($left.current && $top.current) {
      const { width } = $left.current.getBoundingClientRect();
      const { height } = $top.current.getBoundingClientRect();
      setSpacing({ xDivide: width, marginTop: height });
    }
  }, [$left]);

  return spacing === null ? { ready: false } : { ready: true, props: spacing };
};

export const Root = ({
  children,
  placement,
  mode,
  xDivide,
  marginTop
}: Pick<
  Props,
  "children" | "placement" | "mode" | "xDivide" | "marginTop"
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
    placement,
    mode,
    xDivide,
    marginTop
  });

  return (
    <animated.div className={css["root"]} style={{ left, top, right, bottom }}>
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
  );
};
