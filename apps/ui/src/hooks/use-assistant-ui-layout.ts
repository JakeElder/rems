import { useSpring } from "@react-spring/web";
import { AssistantState } from "@rems/types";
import tinycolor from "tinycolor2";
import { CHAT_PALETTE } from "../colors";
import { scrollbarWidth } from "@xobotyi/scrollbar-width";

type Placement = AssistantState["placement"];
type Mode = AssistantState["mode"];
type ViewportWidth = number;
type ViewportHeight = number;
type XDivide = number;

const HEADER_HEIGHT = 60;
const DEFAULT_WIDTH = 580;
const DEFAULT_HEIGHT = 670;
const FRAME_PAD = 26;

const calc = {
  left({
    placement,
    right,
    vw,
    xDivide
  }: {
    placement: Placement;
    right: number;
    vw: ViewportWidth;
    xDivide: XDivide;
  }) {
    if (placement === "MINIMISED" || placement === "DOCKED") {
      return vw - (right + DEFAULT_WIDTH);
    }

    if (placement === "WINDOWED") {
      return 0;
    }

    if (placement === "LEFT") {
      return FRAME_PAD;
    }

    if (placement === "RIGHT") {
      const padding = FRAME_PAD * 2;
      const available = vw - xDivide - padding;

      const width = Math.max(DEFAULT_WIDTH, available);
      return vw - (FRAME_PAD + width);
    }

    throw new Error();
  },

  right({
    placement,
    vw,
    xDivide
  }: {
    placement: Placement;
    vw: ViewportWidth;
    xDivide: XDivide;
  }) {
    if (placement === "MINIMISED" || placement === "DOCKED") {
      return 30;
    }

    if (placement === "WINDOWED") {
      return 0;
    }

    if (placement === "LEFT") {
      const padding = FRAME_PAD * 2;
      const available = xDivide - padding;

      const width = Math.max(DEFAULT_WIDTH, available);
      return vw - (FRAME_PAD + width);
    }

    if (placement === "RIGHT") {
      return FRAME_PAD;
    }

    throw new Error();
  },

  top({
    placement,
    vh,
    padding,
    marginTop
  }: {
    placement: Placement;
    vh: ViewportHeight;
    padding: number;
    marginTop: number;
  }) {
    if (placement === "MINIMISED") {
      return vh - (HEADER_HEIGHT + padding);
    }

    if (placement === "DOCKED") {
      return vh - (DEFAULT_HEIGHT + padding);
    }

    if (placement === "WINDOWED") {
      return 0;
    }

    if (placement === "LEFT" || placement === "RIGHT") {
      return marginTop + FRAME_PAD;
    }

    throw new Error();
  },

  bottom({ placement, padding }: { placement: Placement; padding: number }) {
    if (placement === "MINIMISED") {
      return -(DEFAULT_HEIGHT - (HEADER_HEIGHT + padding));
    }

    if (placement === "DOCKED" || placement === "WINDOWED") {
      return 0;
    }

    if (placement === "LEFT" || placement === "RIGHT") {
      return FRAME_PAD;
    }

    throw new Error();
  },

  padding({ placement }: { placement: Placement }) {
    return placement === "WINDOWED" ? 60 : 20;
  },

  borderRadius({ placement }: { placement: Placement }) {
    if (placement === "DOCKED") {
      return "13px 13px 13px 13px";
    }

    if (placement === "WINDOWED") {
      return "0px 0px 0px 0px";
    }

    return "13px 13px 13px 13px";
  },

  boxShadow({ placement }: { placement: Placement }) {
    return placement === "MINIMISED"
      ? "0 0 5px 0 rgba(0, 0, 0, 0)"
      : "0 0 5px 0 rgba(0, 0, 0, 0.4)";
  },

  backdropFilter({ placement }: { placement: Placement }) {
    return placement === "MINIMISED" ? "blur(0px)" : "blur(4px)";
  },

  backgroundColor({ placement, mode }: { placement: Placement; mode: Mode }) {
    return tinycolor(CHAT_PALETTE[mode].labelBg)
      .setAlpha(placement === "MINIMISED" ? 0 : 0.5)
      .toRgbString();
  }
};

type Props = {
  placement: Placement;
  mode: Mode;
  xDivide: number;
  marginTop: number;
};

const useAssistantUiLayout = ({
  placement,
  mode,
  xDivide,
  marginTop
}: Props) => {
  const vw = window.innerWidth - scrollbarWidth()!;
  const vh = window.innerHeight;

  const padding = calc.padding({ placement });
  const right = calc.right({ placement, vw, xDivide });
  const left = calc.left({ placement, right, vw, xDivide });
  const top = calc.top({ placement, vh, padding, marginTop });
  const bottom = calc.bottom({ placement, padding });
  const background = calc.backgroundColor({ placement, mode });
  const borderRadius = calc.borderRadius({ placement });
  const boxShadow = calc.boxShadow({ placement });
  const backdropFilter = calc.backdropFilter({ placement });

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
      tension: 280,
      friction: 16,
      mass: 0.9
    }
  });

  return style;
};

export default useAssistantUiLayout;
