"use client";

import "regenerator-runtime";
import {
  InputSession,
  Timeline,
  AssistantMode,
  AssistantPlacement
} from "@rems/types";
import {
  useSession,
  useTimeline,
  useSessions,
  useAssistantPlacement,
  useAssistantMode,
  useKeyboardState,
  useAssistantLanguage
} from "@/state";

type Return = {
  sessions: InputSession[];
  enterDown: boolean;
  spaceDown: boolean;
  timeline: Timeline;
  mode: AssistantMode;
  placement: AssistantPlacement;
  lang: "EN" | "TH";
  session: InputSession;
  submittable: boolean;
};

const useAssistantState = (): Return => {
  const sessions = useSessions();
  const session = useSession();
  const timeline = useTimeline();
  const placement = useAssistantPlacement();
  const mode = useAssistantMode();
  const keyboardState = useKeyboardState();
  const lang = useAssistantLanguage();

  return {
    sessions,
    placement,
    enterDown: keyboardState.enterDown,
    spaceDown: keyboardState.spaceDown,
    timeline,
    mode,
    lang,
    session,
    submittable:
      !!session.value &&
      (session.state === "INPUTTING" || session.state === "INACTIVE")
  };
};

export default useAssistantState;
