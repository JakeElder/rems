import { useSpring } from "@react-spring/web";
import { AssistantState, AssistantUiState } from "@rems/types";
import tinycolor from "tinycolor2";
import { CHAT_PALETTE } from "../colors";
import { assistantStateToGroupedAssistantState } from "../adapters";

type UiState = AssistantUiState;

type ViewportWidth = number;

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
    width: number;
    vw: ViewportWidth;
  }) {
    return 500;
  },

  right({ state }: { state: UiState }) {
    return 30;
  },

  top({ state }: { state: UiState }) {
    return 50;
  },

  bottom({ state }: { state: UiState }) {
    return 50;
  },

  padding({ state }: { state: UiState }) {
    return 20;
  },

  borderRadius({ state }: { state: UiState }) {
    return 13;
  },

  boxShadow({ state }: { state: UiState }) {
    return state === "MINIMISED"
      ? "0 0 5px 0 rgba(0, 0, 0, 0)"
      : "0 0 5px 0 rgba(0, 0, 0, 0.4)";
  },

  backdropFilter({ state }: { state: UiState }) {
    return state === "MINIMISED" ? "blur(4px)" : "blur(0px)";
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
  const width = calc.width({ state });
  const height = calc.height({ state });
  const right = calc.right({ state });
  const left = calc.left({ state, right, width, vw: 1000 });
  const top = calc.top({ state });
  const bottom = calc.bottom({ state });
  const padding = calc.padding({ state });
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
