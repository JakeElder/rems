"use client";

import React from "react";
import css from "./AiSearch.module.css";
import { ColorRing, LineWave } from "react-loader-spinner";
import { AiSearchInputState, QueryStateHistory } from "@rems/types";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMicrophoneLines } from "@fortawesome/free-solid-svg-icons";
import Color from "color";

type InputHTMLProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type Props = {
  onChange?: InputHTMLProps["onChange"];
  onSubmit?: React.FormHTMLAttributes<HTMLFormElement>["onSubmit"];
  onMicClick?: () => void;
  value?: InputHTMLProps["value"];
  debug?: boolean;
  history: QueryStateHistory;
  state: AiSearchInputState;
};

const useHideShow = (show: boolean) => {
  const hidden = { opacity: 0, scale: 0.8 };
  const visible = { opacity: 1, scale: 1 };

  return useTransition(show, {
    from: hidden,
    enter: visible,
    leave: hidden
  });
};

const Status = ({ state }: { state: AiSearchInputState }) => {
  const loader = useHideShow(state === "resolving");
  const check = useHideShow(state === "resolved");
  const inputting = useHideShow(state === "listening" || state === "inputting");

  return (
    <div className={css["state"]}>
      {loader(
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
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
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
                color="#ad3dbf"
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

const useColors = (state: AiSearchInputState) => {
  const map: Record<
    AiSearchInputState,
    {
      backgroundColor: string;
      borderColor: string;
      color: string;
    }
  > = {
    inactive: {
      borderColor: "#aaa",
      backgroundColor: Color("#aaa").lighten(0.95).hex(),
      color: Color("#aaa").darken(0.3).hex()
    },
    inputting: {
      borderColor: "#ad3dbf",
      backgroundColor: Color("#ad3dbf").lighten(0.95).hex(),
      color: Color("#ad3dbf").darken(0.3).hex()
    },
    listening: {
      borderColor: "#ad3dbf",
      backgroundColor: Color("#ad3dbf").lighten(0.95).hex(),
      color: Color("#ad3dbf").darken(0.3).hex()
    },
    resolving: {
      borderColor: "#ecbb56",
      backgroundColor: Color("#ecbb56").lighten(0.55).hex(),
      color: Color("#ecbb56").darken(0.3).hex()
    },
    resolved: {
      borderColor: "#19c351",
      backgroundColor: Color("#19c351").lighten(1.15).hex(),
      color: Color("#19c351").darken(0.3).hex()
    },
    committed: {
      borderColor: "#ccc",
      backgroundColor: Color("#ccc").lighten(0.95).hex(),
      color: Color("#ccc").darken(0.3).hex()
    }
  };

  const { borderColor, color, backgroundColor } = map[state];

  return useSpring({ backgroundColor, borderColor, color });
};

const Input = React.forwardRef<
  HTMLInputElement,
  { state: AiSearchInputState } & InputHTMLProps
>(({ state, ...props }, ref) => {
  const style = useColors(state);
  return (
    <animated.div style={style} className={css["input-container"]}>
      <input
        ref={ref}
        {...props}
        className={css["input"]}
        disabled={state !== "inactive" && state !== "inputting"}
      />
      <Status state={state} />
    </animated.div>
  );
});

const DebugAiSearch = ({
  onChange,
  value,
  history,
  state
}: Omit<Props, "debug">) => {
  return (
    <div className={css["debug-root"]}>
      {history.map((h) => {
        return <Input state="committed" value={h.nl} />;
      })}
      <Input state={state} value={value} onChange={onChange} />
    </div>
  );
};

const AiSearch = React.forwardRef<HTMLInputElement, Props>(
  ({ debug, ...props }, ref) => {
    if (debug) {
      return <DebugAiSearch {...props} />;
    }

    const { onChange, value, onMicClick, state, onSubmit } = props;

    return (
      <div className={css["root"]}>
        <form className={css["form"]} onSubmit={onSubmit}>
          <div className={css["input-state-and-controls"]}>
            <div className={css["input-state"]}>
              <Input
                ref={ref}
                state={props.state}
                className={css["input"]}
                autoComplete="off"
                name="query"
                value={value}
                onChange={onChange}
              />
            </div>
            <div className={css["controls"]}>
              <Controls onMicClick={onMicClick} state={state} />
            </div>
          </div>
        </form>
      </div>
    );
  }
);

const Controls = ({
  onMicClick,
  state
}: Pick<Props, "onMicClick" | "state">) => {
  const style = useColors(state);
  const listen = useHideShow(state === "inactive" || state === "listening");

  return (
    <div className={css["controls"]}>
      <animated.div className={css["mic"]} style={{ color: style.color }}>
        {listen(
          (style, show) =>
            show && (
              <animated.button
                style={style}
                onClick={onMicClick}
                type="button"
                className={css["listen-button"]}
              >
                <FontAwesomeIcon icon={faMicrophoneLines} />
              </animated.button>
            )
        )}
      </animated.div>
    </div>
  );
};

export default AiSearch;
