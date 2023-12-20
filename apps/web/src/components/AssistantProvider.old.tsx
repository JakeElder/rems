// @ts-nocheck
import { useCallback } from "react";
import "regenerator-runtime";

import useAssistantKeys from "@/hooks/use-assistant-keys";
import { Sound } from "@/utils";
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
} from "@rems/react-speech-recognition";
import { useDebouncedCallback } from "use-debounce";
import { Chat } from "@rems/ui";
import useDomElements from "@/hooks/use-dom-elements";
import {
  handleAssistantPlacementChangeRequest,
  handleEmptySubmission,
  handleInputIdle,
  handleListeningAborted,
  handleListeningStarted,
  handleSpaceKeyDown,
  handleSpaceKeyUp,
  handleUserYield,
  handleVoiceInputReceived,
  useDispatch,
  useState
} from "@/state";
import handover from "utils/yield";

type Props = {
  children: React.ReactNode;
};

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;
type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

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

  const state = useState();

  const { $header, $listings } = useDomElements();

  const spacing = Chat.useAssistantSpacingUtility({
    $top: $header,
    $left: $listings
  });

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch(handleInputIdle()),
    500
  );

  const session =
    state.slices.assistant.sessions[state.slices.assistant.sessions.length - 1];

  useEffect(() => {
    if (listening) {
      setTimeout(() => {
        dispatch(handleListeningStarted());
      }, 100);
      return;
    } else if (session.value) {
      process();
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
      process();
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
    const { value } = e.currentTarget;
    dispatch({ type: "KEYBOARD_INPUT_RECEIVED", value });
    debouncedSetInactive();
  }, []);

  const onEventRendered: Context["onEventRendered"] = useCallback((e) => {
    console.log(e);
  }, []);

  const process = () => {
    debouncedSetInactive.cancel();

    if (session.value.length === 0) {
      dispatch(handleEmptySubmission());
      throw new Error();
    }

    dispatch(handleUserYield(session.value));
    const req = handover(state);

    let responsePromise: Promise<void> = Promise.resolve();

    req.subscribe({
      next: (c) => {
        const { event: e } = c;

        if (e.type === "ANALYSIS_PERFORMED") {
          analysis = e.analysis;

          dispatch({
            type: "ANALYSIS_COMPLETE",
            capability: analysis.capability
          });

          if (analysis.capability === "CLEAR_QUERY") {
            reset(true);
          }

          if (analysis.capability === "NEW_QUERY") {
            reset(false);
          }
        }

        if (e.type === "STATE_MUTATION") {
        }

        if (e.type === "LANGUAGE_BASED") {
          responsePromise =
            state.uiState !== "MINIMISED"
              ? Sound.speak(e.message)
              : Promise.resolve();
        }

        if (e.type === "YIELD") {
          if (
            analysis.capability === "REFINE_QUERY" ||
            analysis.capability === "NEW_QUERY"
          ) {
            commit();
          }

          responsePromise.then(() => {
            dispatch({ type: "SUCCESSFUL_ASSISTANT_REQUEST" });
            setTimeout(() => {
              dispatch({ type: "SESSION_COMPLETE" });
            }, 400);
          });
        }
      }
    });

    return req;
  };

  const base: BaseContext = {
    // Handlers
    onKeyDown,
    onKeyUp,
    onMicClick,
    onChange,
    onEventRendered,

    // State
    sessions: state.slices.assistant.sessions,
    placement: state.slices.assistant.placement,
    enterDown: state.slices.keyboard.enterDown,
    spaceDown: state.slices.keyboard.spaceDown,
    timeline: state.timeline,
    mode: state.slices.assistant.mode,
    lang: "EN",

    // Computed
    session,
    submittable:
      !!session.value &&
      (session.state === "INPUTTING" || session.state === "INACTIVE")
  };

  const context: Context = spacing.ready
    ? { ready: true, ...base, ...spacing.props }
    : { ready: false, ...base };

  return (
    <AssistantContext.Provider value={context}>
      {children}
    </AssistantContext.Provider>
  );
};

export default AssistantProvider;
