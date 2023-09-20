"use client";

import React, { MutableRefObject, useMemo } from "react";
import css from "./Chat.module.css";
import { Timeline } from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/avatar.png";
import ror from "../../assets/ror.png";
import { Pick, animated, useSpring, useTransition } from "@react-spring/web";
import ChatMessage from "../ChatMessage";
import { Observable } from "@legendapp/state";

type Props = {
  audio?: MutableRefObject<{ message?: HTMLAudioElement }>;
  onOpenClose: (open: boolean) => void;
  $timeline: Observable<Timeline>;
  lang: "en" | "th";
  state:
    | "SLEEPING"
    | "THINKING"
    | "REFINING_QUERY"
    | "CLEARING_QUERY"
    | "CHATTING";
  open: boolean;
};

const OpenClose = ({
  open,
  onOpenClose
}: Pick<Props, "open" | "onOpenClose">) => {
  const { rotate } = useSpring({ rotate: open ? 0 : 180 });

  return (
    <animated.button
      className={css["open-close-button"]}
      onClick={() => onOpenClose(!open)}
      style={{
        transform: rotate.to((value) => `rotate(${value}deg)`)
      }}
    >
      <FontAwesomeIcon className={css["close"]} icon={faCaretDown} size="xs" />
    </animated.button>
  );
};

const Header = ({
  state,
  lang,
  open,
  onOpenClose
}: Pick<Props, "state" | "lang" | "open" | "onOpenClose">) => {
  return (
    <div className={css["header"]}>
      <div className={css["avatar-name-state"]}>
        <div className={css["avatar"]}>
          <img className={css["remi"]} src={avatar.src} />
          <div className={css["ror"]}>
            <img src={ror.src} width={ror.width / 2} height={ror.height / 2} />
          </div>
          <div className={css["shadow"]} />
        </div>
        <div className={css["name"]}>Remi</div>
        <div className={css["state"]}>{state}</div>
      </div>
      <div className={css["lang-open-close"]}>
        <div className={css["lang"]}>{lang}</div>
        <div className={css["open-close"]}>
          <OpenClose open={open} onOpenClose={onOpenClose} />
        </div>
      </div>
    </div>
  );
};

const Body = React.memo(
  ({ $timeline, audio }: Pick<Props, "$timeline" | "audio">) => {
    const refMap = useMemo(() => new WeakMap(), []);

    // @ts-ignore
    $timeline.use();

    const messages = $timeline
      .get()
      .slice()
      .reverse()
      .filter((e) => {
        if (e.type === "USER") {
          if (
            e.interaction.type === "VERBAL" ||
            e.interaction.type === "WRITTEN"
          ) {
            return true;
          }
        }
        if (e.type === "ASSISTANT") {
          if (e.message.type === "REACTION") {
            return true;
          }
        }
        return false;
      });

    const transitions = useTransition(messages, {
      keys: (item) => item.id,
      from: { opacity: 0, height: 0 },
      enter: (item) => async (next) => {
        if (
          item.type === "ASSISTANT" &&
          item.message.type === "REACTION" &&
          item.message.reaction.type === "PATCH"
        ) {
          audio?.current?.message?.play();
        }
        const $el = refMap.get(item);
        if ($el) {
          await next({ opacity: 1, height: $el.offsetHeight });
        }
      },
      leave: [{ opacity: 0 }, { height: 0 }]
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
  () => true
);

const BodyReveal = ({
  open,
  children
}: { children: React.ReactNode } & Pick<Props, "open">) => {
  const style = useSpring({ height: open ? 400 : 0 });
  return <animated.div style={style}>{children}</animated.div>;
};

const Chat = ({ $timeline, state, lang, open, audio, onOpenClose }: Props) => {
  return (
    <div className={css["root"]}>
      <Header state={state} lang={lang} open={open} onOpenClose={onOpenClose} />
      <BodyReveal open={open}>
        <Body $timeline={$timeline} audio={audio} />
      </BodyReveal>
    </div>
  );
};
export default Chat;
