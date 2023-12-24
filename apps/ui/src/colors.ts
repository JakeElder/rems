import { AssistantState, InputSession } from "@rems/types";

type ChatPalette = {
  avatarBorder: string;
  labelBg: string;
  labelColor: string;
};

type InputPalette = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

type MicPalette = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

type InputTheme = {
  input: Record<InputSession["state"], InputPalette>;
  mic: Record<InputSession["state"], MicPalette>;
};

type Themes = Record<"header" | "chat", InputTheme>;

export const CHAT_PALETTE: Record<AssistantState["mode"], ChatPalette> = {
  // Gray
  SLEEPING: {
    avatarBorder: "#d1d1d1",
    labelBg: "#F2F2F2",
    labelColor: "#555"
  },

  // Blue
  LISTENING: {
    avatarBorder: "#00acd6",
    labelBg: "#00b8e5",
    labelColor: "#fff"
  },

  // Orange
  THINKING: {
    avatarBorder: "#ecbb56",
    labelBg: "#ecbb56",
    labelColor: "#fff"
  },

  // Purple
  WORKING: {
    avatarBorder: "#8850a2",
    labelBg: "#8850a2",
    labelColor: "#fff"
  },

  // Green
  CHATTING: {
    avatarBorder: "#439a5f",
    labelBg: "#439a5f",
    labelColor: "#fff"
  }
};

const CHAT_INPUT_INPUTTING: InputPalette = {
  borderColor: "#00acd6",
  backgroundColor: "#fff",
  color: "#00a3cc"
};

const CHAT_INPUT_NEUTRAL: InputPalette = {
  borderColor: "#fff",
  backgroundColor: "#fff",
  color: "#333333"
};

const HEADER_INPUT_NEUTRAL: InputPalette = {
  borderColor: "#ccc",
  backgroundColor: "#fff",
  color: "#333333"
};

const MIC_DISABLED: MicPalette = {
  ...CHAT_INPUT_NEUTRAL,
  color: "rgba(0, 0, 0, 0.4)"
};

const HEADER_INPUT_THEME: InputTheme = {
  input: {
    QUEUED: HEADER_INPUT_NEUTRAL,
    INACTIVE: HEADER_INPUT_NEUTRAL,

    INPUTTING: CHAT_INPUT_INPUTTING,
    LISTENING: CHAT_INPUT_INPUTTING,

    ANALYZING: {
      borderColor: "#ecbb56",
      backgroundColor: "#fff",
      color: "#daa73d"
    },

    RESOLVING: {
      borderColor: "#8850a2",
      backgroundColor: "#fff",
      color: "#8850a2"
    },

    RESOLVED: {
      borderColor: "#439a5f",
      backgroundColor: "#fff",
      color: "#0e7730"
    },

    COMMITTED: HEADER_INPUT_NEUTRAL
  },
  mic: {
    QUEUED: CHAT_INPUT_NEUTRAL,
    INACTIVE: {
      ...CHAT_INPUT_NEUTRAL,
      color: "#555",
      borderColor: "#fff"
    },

    ANALYZING: MIC_DISABLED,
    INPUTTING: MIC_DISABLED,
    LISTENING: CHAT_INPUT_INPUTTING,

    RESOLVED: MIC_DISABLED,

    COMMITTED: MIC_DISABLED,
    RESOLVING: MIC_DISABLED
  }
};

const CHAT_INPUT_THEME: InputTheme = {
  input: {
    QUEUED: CHAT_INPUT_NEUTRAL,
    INACTIVE: CHAT_INPUT_NEUTRAL,

    INPUTTING: CHAT_INPUT_INPUTTING,
    LISTENING: CHAT_INPUT_INPUTTING,

    ANALYZING: {
      borderColor: "#ecbb56",
      backgroundColor: "#f5f5f5",
      color: "#ebdbbc"
    },

    RESOLVING: {
      borderColor: "#8850a2",
      backgroundColor: "#fff",
      color: "#8850a2"
    },

    RESOLVED: {
      borderColor: "#439a5f",
      backgroundColor: "#f5f5f5",
      color: "#0e7730"
    },

    COMMITTED: CHAT_INPUT_NEUTRAL
  },
  mic: {
    QUEUED: CHAT_INPUT_NEUTRAL,
    INACTIVE: {
      ...CHAT_INPUT_NEUTRAL,
      color: "#555",
      borderColor: "#fff"
    },

    ANALYZING: MIC_DISABLED,
    INPUTTING: MIC_DISABLED,
    LISTENING: CHAT_INPUT_INPUTTING,

    RESOLVED: MIC_DISABLED,

    COMMITTED: MIC_DISABLED,
    RESOLVING: MIC_DISABLED
  }
};

export const INPUT_THEMES: Themes = {
  header: HEADER_INPUT_THEME,
  chat: CHAT_INPUT_THEME
};
