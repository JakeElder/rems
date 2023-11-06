"use client";

import "regenerator-runtime";
import {
  InputSession,
  Timeline,
  AssistantMode,
  AssistantPlacement
} from "@rems/types";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Chat } from "@rems/ui";
import useDomElements from "@/hooks/use-dom-elements";
import {
  store,
  handleEmptySubmission,
  handleInputIdle,
  handleListeningAborted,
  handleListeningStarted,
  handleUserYield,
  handleVoiceInputReceived,
  useDispatch,
  useSession,
  useTimeline,
  useSessions,
  useAssistantPlacement,
  useAssistantMode,
  useKeyboardState
} from "@/state";
import { yld } from "@/utils";
import { useSpeechRecognition } from "react-speech-recognition";

type BaseReturn = {
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

type Return =
  | ({ ready: false } & BaseReturn)
  | ({ ready: true } & BaseReturn & Chat.Spacing);

const useAssistantState = (): Return => {
  const { transcript, listening } = useSpeechRecognition();
  const dispatch = useDispatch();

  const { $header, $listings } = useDomElements();

  const spacing = Chat.useAssistantSpacingUtility({
    $top: $header,
    $left: $listings
  });

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch(handleInputIdle()),
    500
  );

  const sessions = useSessions();
  const session = useSession();
  const timeline = useTimeline();
  const placement = useAssistantPlacement();
  const mode = useAssistantMode();
  const keyboardState = useKeyboardState();

  useEffect(() => {
    if (listening) {
      setTimeout(() => {
        dispatch(handleListeningStarted());
      }, 100);
      return;
    } else if (session.value) {
      handleYield();
    } else {
      setTimeout(() => {
        dispatch(handleListeningAborted());
      }, 100);
    }
  }, [listening]);

  useEffect(() => {
    if (listening) {
      dispatch(handleVoiceInputReceived(transcript));
    }
  }, [listening, transcript]);

  const handleYield = () => {
    debouncedSetInactive.cancel();

    if (session.value.length === 0) {
      dispatch(handleEmptySubmission());
      throw new Error();
    }

    dispatch(handleUserYield(session.value));
    const req = yld(store.getState());

    req.subscribe({
      next: (e) => {
        console.log(e);
      }
    });
  };

  const base: BaseReturn = {
    sessions,
    placement,
    enterDown: keyboardState.enterDown,
    spaceDown: keyboardState.spaceDown,
    timeline,
    mode,
    lang: "EN",
    session,
    submittable:
      !!session.value &&
      (session.state === "INPUTTING" || session.state === "INACTIVE")
  };

  return spacing.ready
    ? { ready: true, ...base, ...spacing.props }
    : { ready: false, ...base };
};

export default useAssistantState;
