"use client";

import { useCallback } from "react";
import "regenerator-runtime";

import useAssistantKeys from "@/hooks/use-assistant-keys";
import {
  InputSession,
  Timeline,
  TimelineEvent,
  AssistantMode,
  AssistantPlacement
} from "@rems/types";
import { createContext, useContext, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { useDebouncedCallback } from "use-debounce";
import { Chat } from "@rems/ui";
import { useDomElements } from "@/components/client/DomElementsProvider";
import {
  store,
  handleAssistantPlacementChangeRequest,
  handleEmptySubmission,
  handleInputIdle,
  handleKeyboardInputReceived,
  handleListeningAborted,
  handleListeningStarted,
  handleSpaceKeyDown,
  handleSpaceKeyUp,
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
import yld from "utils/yield";

type Props = {
  children: React.ReactNode;
};

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;

type BaseContext = {
  // Handlers
  onKeyDown: NonNullable<FormAttributes["onKeyDown"]>;
  onKeyUp: NonNullable<FormAttributes["onKeyUp"]>;
  onMicClick: () => void;
  onChange: NonNullable<InputHTMLAttributes["onChange"]>;
  onEventRendered: (e: TimelineEvent) => void;

  // State
  sessions: InputSession[];
  enterDown: boolean;
  spaceDown: boolean;
  timeline: Timeline;
  mode: AssistantMode;
  placement: AssistantPlacement;
  lang: "EN" | "TH";

  // Computed
  session: InputSession;
  submittable: boolean;
};

type Context =
  | ({ ready: false } & BaseContext)
  | ({ ready: true } & BaseContext & Chat.Spacing);

const AssistantContext = createContext<Context | null>(null);
export const useAssistant = () => useContext(AssistantContext)!;

const AssistantProvider = ({ children }: Props) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
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

  useAssistantKeys({
    spaceDown: () => {
      dispatch(handleSpaceKeyDown());
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    },
    spaceUp: () => {
      dispatch(handleSpaceKeyUp());
      SpeechRecognition.stopListening();
    },
    plus: () => {
      dispatch(handleAssistantPlacementChangeRequest("EXPAND"));
    },
    minus: () => {
      dispatch(handleAssistantPlacementChangeRequest("CONTRACT"));
    },
    escape: () => {
      dispatch(handleAssistantPlacementChangeRequest("MINIMIZE"));
    },
    leftBrace: () => {
      dispatch(handleAssistantPlacementChangeRequest("FRAME_LEFT"));
    },
    rightBrace: () => {
      dispatch(handleAssistantPlacementChangeRequest("FRAME_RIGHT"));
    }
  });

  const onKeyDown: Context["onKeyDown"] = useCallback((e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      dispatch({ type: "ENTER_KEY_DOWN" });
    }
  }, []);

  const onKeyUp: Context["onKeyUp"] = useCallback((e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      dispatch({ type: "ENTER_KEY_UP" });
      handleYield();
    }
  }, []);

  const onMicClick: Context["onMicClick"] = useCallback(() => {
    if (session.state === "LISTENING") {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening();
    }
  }, []);

  const onChange: Context["onChange"] = useCallback((e) => {
    dispatch(handleKeyboardInputReceived(e.currentTarget.value));
    debouncedSetInactive();
  }, []);

  const onEventRendered: Context["onEventRendered"] = useCallback((e) => {
    console.log(e);
  }, []);

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

  const base: BaseContext = {
    // Handlers
    onKeyDown,
    onKeyUp,
    onMicClick,
    onChange,
    onEventRendered,

    // State
    sessions,
    placement,
    enterDown: keyboardState.enterDown,
    spaceDown: keyboardState.spaceDown,
    timeline,
    mode,
    lang: "EN",

    // Computed
    session,
    submittable:
      !!session.value &&
      (session.state === "INPUTTING" || session.state === "INACTIVE")
  };

  return (
    <AssistantContext.Provider
      value={
        spacing.ready
          ? { ready: true, ...base, ...spacing.props }
          : { ready: false, ...base }
      }
      children={children}
    />
  );
};

export default AssistantProvider;
