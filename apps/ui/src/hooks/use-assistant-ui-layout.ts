import { useSpring } from "@react-spring/web";
import { AssistantState, AssistantUiState } from "@rems/types";
import tinycolor from "tinycolor2";
import { CHAT_PALETTE } from "../colors";
import { assistantStateToGroupedAssistantState } from "../adapters";

type UiState = AssistantUiState;

type ViewportWidth = number;
type ViewportHeight = number;
type XDivide = number;

const HEADER_HEIGHT = 60;
const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 570;
const FRAME_PAD = 30;

const calc = {
  left({
    state,
    right,
    vw,
    xDivide
  }: {
    state: UiState;
    right: number;
    vw: ViewportWidth;
    xDivide: XDivide;
  }) {
    if (state === "MINIMISED" || state === "DOCKED") {
      return vw - (right + DEFAULT_WIDTH);
    }

    if (state === "WINDOWED") {
      return 0;
    }

    if (state === "LEFT") {
      return FRAME_PAD;
    }

    if (state === "RIGHT") {
      const padding = FRAME_PAD * 2;
      const available = vw - xDivide - padding;

      const width = Math.max(DEFAULT_WIDTH, available);
      return vw - (FRAME_PAD + width);
    }

    throw new Error();
  },

  right({
    state,
    vw,
    xDivide
  }: {
    state: UiState;
    vw: ViewportWidth;
    xDivide: XDivide;
  }) {
    if (state === "MINIMISED" || state === "DOCKED") {
      return 30;
    }

    if (state === "WINDOWED") {
      return 0;
    }

    if (state === "LEFT") {
      const padding = FRAME_PAD * 2;
      const available = xDivide - padding;

      const width = Math.max(DEFAULT_WIDTH, available);
      return vw - (FRAME_PAD + width);
    }

    if (state === "RIGHT") {
      return FRAME_PAD;
    }

    throw new Error();
  },

  top({
    state,
    vh,
    padding,
    marginTop
  }: {
    state: UiState;
    vh: ViewportHeight;
    padding: number;
    marginTop: number;
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

    if (state === "LEFT" || state === "RIGHT") {
      return marginTop + FRAME_PAD;
    }

    throw new Error();
  },

  bottom({ state, padding }: { state: UiState; padding: number }) {
    if (state === "MINIMISED") {
      return -(DEFAULT_HEIGHT - (HEADER_HEIGHT + padding));
    }

    if (state === "DOCKED" || state === "WINDOWED") {
      return 0;
    }

    if (state === "LEFT" || state === "RIGHT") {
      return FRAME_PAD;
    }

    throw new Error();
  },

  padding({ state }: { state: UiState }) {
    return state === "WINDOWED" ? 60 : 20;
  },

  borderRadius({ state }: { state: UiState }) {
    if (state === "DOCKED") {
      return "13px 13px 13px 13px";
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
  xDivide: number;
  marginTop: number;
};

const useAssistantUiLayout = ({
  state,
  assistantState,
  xDivide,
  marginTop
}: Props) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const padding = calc.padding({ state });
  const right = calc.right({ state, vw, xDivide });
  const left = calc.left({ state, right, vw, xDivide });
  const top = calc.top({ state, vh, padding, marginTop });
  const bottom = calc.bottom({ state, padding });
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
    background,
    config: {
      tension: 180,
      friction: 23,
      mass: 1.1
    }
  });

  return style;
};

export default useAssistantUiLayout;
