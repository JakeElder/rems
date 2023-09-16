"use client";

import React from "react";
import css from "./Chat.module.css";
import { Timeline } from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/avatar.png";
import ror from "../../assets/ror.png";
import { animated, useSpring } from "@react-spring/web";
import ChatMessage from "../ChatMessage";

type Props = {
  timeline: Timeline;
  lang: "en" | "th";
  state: "SLEEPING" | "THINKING";
  open: boolean;
};

const Header = ({ state, lang }: Pick<Props, "state" | "lang">) => {
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
      <div className={css["lang-pin"]}>
        <div className={css["lang"]}>{lang}</div>
        <div className={css["pin"]}>
          <FontAwesomeIcon icon={faThumbtack} size="xs" />
        </div>
      </div>
    </div>
  );
};

const Body = ({ timeline }: Pick<Props, "timeline">) => {
  return (
    <div className={css["body"]}>
      <div className={css["shadow"]} />
      <div className={css["timeline"]}>
        {timeline
          .slice()
          .reverse()
          .map((e) => (
            <ChatMessage key={e.id} {...e} />
          ))}
      </div>
    </div>
  );
};

const Reveal = ({
  open,
  children
}: { children: React.ReactNode } & Pick<Props, "open">) => {
  const style = useSpring({ height: open ? 400 : 0 });
  return <animated.div style={style}>{children}</animated.div>;
};

const Chat = ({ timeline, state, lang, open }: Props) => {
  return (
    <div className={css["root"]}>
      <Header state={state} lang={lang} />
      <Reveal open={open}>
        <Body timeline={timeline} />
      </Reveal>
    </div>
  );
};

export default Chat;
