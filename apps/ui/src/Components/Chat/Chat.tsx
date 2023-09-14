import React from "react";
import css from "./Chat.module.css";
import { Timeline } from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import Message from "../Message/Message";
import avatar from "../../assets/avatar.png";
import ror from "../../assets/ror.png";

type Props = {
  timeline: Timeline;
  lang: "en" | "th";
  state: "SLEEPING" | "THINKING";
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
          .map((m) => (
            <Message key={m.id} {...m} />
          ))}
      </div>
    </div>
  );
};

const Chat = ({ timeline, state, lang }: Props) => {
  return (
    <div className={css["root"]}>
      <Header state={state} lang={lang} />
      <Body timeline={timeline} />
    </div>
  );
};

export default Chat;
