"use client";

import React from "react";
import css from "./ChatInput.module.css";
import { ColorRing, LineWave } from "react-loader-spinner";
import { InputSession } from "@rems/types";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMicrophoneLines } from "@fortawesome/free-solid-svg-icons";
import c from "tinycolor2";
import EnterIcon from "../../Elements/EnterIcon/EnterIcon";
import cn from "classnames";
import { INPUT_THEMES } from "../../colors";

type InputHTMLProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const useHideShow = (show: boolean) => {
  const hidden = { opacity: 0, scale: 0.8 };
  const visible = { opacity: 1, scale: 1 };

  return useTransition(show, {
    from: hidden,
    enter: visible,
    leave: hidden
  });
};

const Status = ({
  state,
  theme
}: Pick<Props, "theme"> & { state: InputSession["state"] }) => {
  const analyzing = useHideShow(state === "ANALYZING");
  const resolving = useHideShow(state === "RESOLVING");
  const check = useHideShow(state === "RESOLVED");
  const inputting = useHideShow(state === "LISTENING" || state === "INPUTTING");

  return (
    <div className={css["state"]}>
      {resolving(
        (style, show) =>
          show && (
            <animated.div style={style} className={css["loader"]}>
              <ColorRing
                visible={true}
                height={38}
                width={38}
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={
                  c(INPUT_THEMES[theme].input["RESOLVING"].borderColor)
                    .analogous(5)
                    .map((c) => c.setAlpha(0.25).toString()) as any
                }
              />
            </animated.div>
          )
      )}
      {analyzing(
        (style, show) =>
          show && (
            <animated.div style={style} className={css["loader"]}>
              <ColorRing
                visible={true}
                height={38}
                width={38}
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={
                  c(INPUT_THEMES[theme].input["ANALYZING"].borderColor)
                    .analogous(5)
                    .map((c) => c.setAlpha(0.2).toString()) as any
                }
              />
            </animated.div>
          )
      )}
      {check(
        (style, show) =>
          show && (
            <animated.div style={style} className={css["resolved"]}>
              <FontAwesomeIcon icon={faCheck} />
            </animated.div>
          )
      )}
      {inputting(
        (style, show) =>
          show && (
            <animated.div style={style} className={css["inputting"]}>
              <LineWave
                height={34}
                width={34}
                color="#00a3cc"
                ariaLabel="line-wave"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                firstLineColor=""
                middleLineColor=""
                lastLineColor=""
              />
            </animated.div>
          )
      )}
    </div>
  );
};

export type Props = {
  onChange?: InputHTMLProps["onChange"];
  onMicClick?: () => void;
  enterDown: boolean;
  sessions: InputSession[];
  submittable: boolean;
  theme: "header" | "chat";
} & Pick<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onKeyDown" | "onKeyUp"
>;

const Input = React.forwardRef<
  HTMLInputElement,
  Pick<Props, "enterDown" | "submittable" | "sessions" | "theme"> &
    InputHTMLProps
>(({ enterDown, submittable, sessions, theme, ...props }, ref) => {
  const session = sessions[sessions.length - 1];

  const style = useSpring(INPUT_THEMES[theme].input[session.state]);

  const submit = useTransition(submittable, {
    from: { opacity: 0, width: 0 },
    enter: { opacity: 1, width: 30 },
    leave: { opacity: 0, width: 0 }
  });

  const t = useTransition(sessions, {
    keys: (s) => s.id,
    from: { height: 0 },
    enter: { height: 48 }
  });

  return (
    <animated.div
      style={style}
      className={cn(css["container"], css[`container-${theme}`])}
    >
      <div className={css["session-container"]}>
        {t((style, s) => {
          return (
            <animated.div style={style}>
              {(() => {
                if (session.state === "COMMITTED") {
                  return (
                    <input
                      key={s.id}
                      value={s.value}
                      className={css["input"]}
                      disabled
                    />
                  );
                }
                return (
                  <input
                    ref={ref}
                    key={s.id}
                    value={s.value}
                    className={css["input"]}
                    disabled={
                      session.state !== "INACTIVE" &&
                      session.state !== "INPUTTING"
                    }
                    {...props}
                  />
                );
              })()}
            </animated.div>
          );
        })}
      </div>

      <div className={css["enter-and-status"]}>
        <div className={css["status"]}>
          <Status state={session.state} theme={theme} />
        </div>
        {submit(
          (style, show) =>
            show && (
              <animated.div style={style}>
                <div
                  className={cn(css["enter"], {
                    [css["enter-down"]]: enterDown
                  })}
                >
                  <EnterIcon />
                </div>
              </animated.div>
            )
        )}
      </div>
    </animated.div>
  );
});

const ChatInput = React.forwardRef<HTMLInputElement, Props>(
  (
    { onChange, sessions, onMicClick, enterDown, submittable, theme, ...rest },
    ref
  ) => {
    return (
      <div className={css["root"]}>
        <form className={css["form"]} {...rest}>
          <div className={css["input-state-and-controls"]}>
            <div className={css["input-state"]}>
              <Input
                theme={theme}
                submittable={submittable}
                enterDown={enterDown}
                ref={ref}
                className={css["input"]}
                autoComplete="off"
                name="query"
                sessions={sessions}
                onChange={onChange}
              />
            </div>
            <div className={css["controls"]}>
              <Controls
                onMicClick={onMicClick}
                sessions={sessions}
                theme={theme}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
);

const Controls = ({
  onMicClick,
  sessions,
  theme
}: Pick<Props, "onMicClick" | "sessions" | "theme">) => {
  const session = sessions[sessions.length - 1];
  const style = useSpring(INPUT_THEMES[theme].mic[session.state]);

  return (
    <div className={css["controls"]}>
      <animated.div className={css["mic"]}>
        <animated.button
          style={style}
          onClick={onMicClick}
          type="button"
          className={cn(css["listen-button"], css[`listen-button-${theme}`])}
        >
          <FontAwesomeIcon icon={faMicrophoneLines} />
        </animated.button>
      </animated.div>
    </div>
  );
};

export default React.memo(ChatInput);
