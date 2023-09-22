import { AssistantInputState, GroupedAssistantState } from "@rems/types";

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
    labelColor: "#333333"
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

export const INPUT_PALETTE: Record<AssistantInputState, InputPalette> = {
  INACTIVE: INPUT_NEUTRAL,

  INPUTTING: INPUT_INPUTTING,
  LISTENING: INPUT_INPUTTING,

  RESOLVED: {
    borderColor: "#439a5f",
    backgroundColor: "#439a5f",
    color: "#fff"
  },

  COMMITTED: INPUT_NEUTRAL,
  RESOLVING: {
    borderColor: "#ecbb56",
    backgroundColor: "#5b5b5b",
    color: "#fff"
  }
};

type MicPalette = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

const MIC_DISABLED: MicPalette = {
  borderColor: "#ddd",
  backgroundColor: "#ddd",
  color: "#ccc"
};

export const MIC_PALETTE: Record<AssistantInputState, MicPalette> = {
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
