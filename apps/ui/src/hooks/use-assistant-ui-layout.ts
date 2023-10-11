import { useSpring } from "@react-spring/web";
import { AssistantState, AssistantUiState } from "@rems/types";
import tinycolor from "tinycolor2";
import { CHAT_PALETTE } from "../colors";
import { assistantStateToGroupedAssistantState } from "../adapters";

type UiState = AssistantUiState;

type ViewportWidth = number;
type ViewportHeight = number;

const HEADER_HEIGHT = 60;
const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 570;

const calc = {
  width({ state }: { state: UiState }) {
    return 440;
  },

  height({ state }: { state: UiState }) {
    return 570;
  },

  left({
    state,
    right,
    vw
  }: {
    state: UiState;
    right: number;
    vw: ViewportWidth;
  }) {
    if (state === "MINIMISED" || state === "DOCKED") {
      return vw - (right + DEFAULT_WIDTH);
    }

    if (state === "WINDOWED") {
      return 0;
    }

    throw new Error();
  },

  right({ state }: { state: UiState }) {
    if (state === "MINIMISED" || state === "DOCKED") {
      return 30;
    }

    if (state === "WINDOWED") {
      return 0;
    }

    throw new Error();
  },

  top({
    state,
    vh,
    padding
  }: {
    state: UiState;
    vh: ViewportHeight;
    padding: number;
  }) {
    if (state === "MINIMISED") {
      return vh - (HEADER_HEIGHT + padding);
    }

    if (state === "DOCKED") {
      return vh - (DEFAULT_HEIGHT + padding);
    }

    if (state === "WINDOWED") {
      return 0;
    }

    throw new Error();
  },

  bottom({
    state,
    vh,
    padding
  }: {
    state: UiState;
    vh: ViewportHeight;
    padding: number;
  }) {
    if (state === "MINIMISED") {
      return -(DEFAULT_HEIGHT - (HEADER_HEIGHT + padding));
    }

    if (state === "DOCKED") {
      return 0;
    }

    if (state === "WINDOWED") {
      return 0;
    }

    throw new Error();
  },

  padding({ state }: { state: UiState }) {
    if (state === "WINDOWED") {
      return 60;
    }
    return 20;
  },

  borderRadius({ state }: { state: UiState }) {
    if (state === "DOCKED") {
      return "13px 13px 0px 0px";
    }

    if (state === "WINDOWED") {
      return "0px 0px 0px 0px";
    }

    return "13px 13px 13px 13px";
  },

  boxShadow({ state }: { state: UiState }) {
    return state === "MINIMISED"
      ? "0 0 5px 0 rgba(0, 0, 0, 0)"
      : "0 0 5px 0 rgba(0, 0, 0, 0.4)";
  },

  backdropFilter({ state }: { state: UiState }) {
    return state === "MINIMISED" ? "blur(0px)" : "blur(4px)";
  },

  backgroundColor({
    state,
    assistantState
  }: {
    state: UiState;
    assistantState: AssistantState;
  }) {
    const group = assistantStateToGroupedAssistantState(assistantState);
    return tinycolor(CHAT_PALETTE[group].labelBg)
      .setAlpha(state === "MINIMISED" ? 0 : 0.5)
      .toRgbString();
  }
};

type Props = {
  state: UiState;
  assistantState: AssistantState;
};

const useAssistantUiLayout = ({ state, assistantState }: Props) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const padding = calc.padding({ state });
  const right = calc.right({ state });
  const left = calc.left({ state, right, vw });
  const top = calc.top({ state, vh, padding });
  const bottom = calc.bottom({ state, vh, padding });
  const background = calc.backgroundColor({ state, assistantState });
  const borderRadius = calc.borderRadius({ state });
  const boxShadow = calc.boxShadow({ state });
  const backdropFilter = calc.backdropFilter({ state });

  const style = useSpring({
    left,
    top,
    right,
    bottom,
    padding,
    borderRadius,
    boxShadow,
    backdropFilter,
    background
  });

  return style;
};

export default useAssistantUiLayout;
