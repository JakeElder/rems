import { GroupedAssistantState, InputSession } from "@rems/types";

type ChatPalette = {
  avatarBorder: string;
  labelBg: string;
  labelColor: string;
};

export const CHAT_PALETTE: Record<GroupedAssistantState, ChatPalette> = {
  // Gray
  IDLE: {
    avatarBorder: "#d1d1d1",
    labelBg: "#F2F2F2",
    labelColor: "#555"
  },

  // Purple
  LISTENING: {
    avatarBorder: "#8850a2",
    labelBg: "#8850a2",
    labelColor: "#fff"
  },

  // Orange
  THINKING: {
    avatarBorder: "#ecbb56",
    labelBg: "#ecbb56",
    labelColor: "#fff"
  },

  // Green
  INTERACTING: {
    avatarBorder: "#439a5f",
    labelBg: "#439a5f",
    labelColor: "#fff"
  }
};

type InputPalette = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

const INPUT_INPUTTING: InputPalette = {
  borderColor: "#8850a2",
  backgroundColor: "#fff",
  color: "#8850a2"
};

const INPUT_NEUTRAL: InputPalette = {
  borderColor: "#fff",
  backgroundColor: "#fff",
  color: "#333333"
};

export const INPUT_PALETTE: Record<InputSession["state"], InputPalette> = {
  QUEUED: INPUT_NEUTRAL,
  INACTIVE: INPUT_NEUTRAL,

  INPUTTING: INPUT_INPUTTING,
  LISTENING: INPUT_INPUTTING,

  RESOLVED: {
    borderColor: "#439a5f",
    backgroundColor: "#fff",
    color: "#0e7730"
  },

  COMMITTED: INPUT_NEUTRAL,
  RESOLVING: {
    borderColor: "#ecbb56",
    backgroundColor: "#f5f5f5",
    color: "#8c8c8c"
  }
};

type MicPalette = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

const MIC_DISABLED: MicPalette = {
  ...INPUT_NEUTRAL,
  color: "rgba(0, 0, 0, 0.4)"
};

export const MIC_PALETTE: Record<InputSession["state"], MicPalette> = {
  QUEUED: INPUT_NEUTRAL,
  INACTIVE: {
    ...INPUT_NEUTRAL,
    color: "#555",
    borderColor: "#fff"
  },

  INPUTTING: MIC_DISABLED,
  LISTENING: INPUT_INPUTTING,

  RESOLVED: MIC_DISABLED,

  COMMITTED: MIC_DISABLED,
  RESOLVING: MIC_DISABLED
};
