import "regenerator-runtime";

import useAssistantKeys from "@/hooks/use-assistant-keys";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { Sound } from "@/utils";
import { observable } from "@legendapp/state";
import {
  InputSession,
  AssistantPayload,
  AssistantState,
  Timeline,
  TimelineEvent,
  AssistantTimelineEvent,
  Analysis,
  AssistantUiState,
  SystemTimelineEvent
} from "@rems/types";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef
} from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import assistantReducer from "reducers/assistant-reducer";
import { Observable } from "rxjs";
import uuid from "short-uuid";
import { useDebouncedCallback } from "use-debounce";
import { Chat } from "@rems/ui";
import { useDomElements } from "@/components/DomElementsProvider";

const NEXT_PUBLIC_REMS_API_URL = process.env.NEXT_PUBLIC_REMS_API_URL;

type Props = {
  children: React.ReactNode;
};

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;
type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

const $timeline = observable<Timeline>([]);

type BaseContext = {
  // Handlers
  onKeyDown: FormAttributes["onKeyDown"];
  onKeyUp: FormAttributes["onKeyUp"];
  onMicClick: () => void;
  onChange: InputHTMLAttributes["onChange"];
  onEventRendered: (e: TimelineEvent) => void;

  // State
  sessions: InputSession[];
  state: AssistantState;
  enterDown: boolean;
  spaceDown: boolean;
  timeline: Timeline;
  uiState: AssistantUiState;
  lang: "en";

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
  const { reset, patch, commit, serverQuery } = useRealEstateQuery();
  const $keyChain = useRef<string[]>([]);

  const { $header, $listings } = useDomElements();
  const spacing = Chat.useAssistantSpacingUtility({
    $top: $header,
    $left: $listings
  });

  $timeline.use();

  const [state, dispatch] = useReducer(assistantReducer, {
    sessions: [{ id: uuid.generate(), value: "", state: "INACTIVE" }],
    state: "SLEEPING",
    uiState: "MINIMISED",
    enterDown: false,
    spaceDown: false
  });

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch({ type: "INPUT_IDLE" }),
    500
  );

  const session = state.sessions[state.sessions.length - 1];

  useEffect(() => {
    if (listening) {
      setTimeout(() => {
        dispatch({ type: "LISTENING_STARTED" });
      }, 100);
      return;
    } else if (session.value) {
      setTimeout(() => {
        dispatch({ type: "LISTENING_COMPLETE" });
      }, 100);
      process();
    } else {
      setTimeout(() => {
        dispatch({ type: "LISTENING_ABORTED" });
      }, 100);
    }
  }, [listening]);

  useEffect(() => {
    if (listening) {
      dispatch({ type: "VOICE_INPUT_RECEIVED", value: transcript });
    }
  }, [listening, transcript]);

  const debouncedClearKeyChain = useDebouncedCallback(() => {
    $keyChain.current = [];
  }, 500);

  const handleUiStateChange = (key: string) => {
    if (
      $keyChain.current.length > 10 &&
      $keyChain.current[$keyChain.current.length - 1] == "}" &&
      $keyChain.current[$keyChain.current.length - 2] == "}"
    ) {
      const message = "Dude what are you doing? You're making me dizzy";
      $timeline.set((prev) => [
        ...prev,
        {
          role: "ASSISTANT",
          id: uuid.generate(),
          date: Date.now(),
          event: {
            type: "LANGUAGE_BASED",
            message
          }
        }
      ]);
      Sound.speak(message);
      $keyChain.current = [];
      return;
    }
    $keyChain.current.push(key);
    debouncedClearKeyChain();
  };

  useAssistantKeys({
    spaceDown: () => {
      dispatch({ type: "SPACE_KEY_DOWN" });
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    },
    spaceUp: () => {
      dispatch({ type: "SPACE_KEY_UP" });
      SpeechRecognition.stopListening();
    },
    plus: () => {
      dispatch({ type: "UI_STATE_CHANGE", value: "EXPAND" });
      handleUiStateChange("+");
    },
    minus: () => {
      dispatch({ type: "UI_STATE_CHANGE", value: "CONTRACT" });
      handleUiStateChange("-");
    },
    escape: () => {
      dispatch({ type: "UI_STATE_CHANGE", value: "MINIMIZE" });
      handleUiStateChange("ESC");
    },
    leftBrace: () => {
      dispatch({ type: "UI_STATE_CHANGE", value: "FRAME_LEFT" });
      handleUiStateChange("{");
    },
    rightBrace: () => {
      dispatch({ type: "UI_STATE_CHANGE", value: "FRAME_RIGHT" });
      handleUiStateChange("}");
    }
  });

  const request = () =>
    new Observable<AssistantTimelineEvent | SystemTimelineEvent>((sub) => {
      const payload: AssistantPayload = {
        timeline: $timeline.get(),
        query: serverQuery
      };

      fetch(`${NEXT_PUBLIC_REMS_API_URL}/assistant`, {
        method: "POST",
        body: JSON.stringify(payload)
      }).then((res) => {
        if (!res.ok || !res.body) {
          sub.error();
          return;
        }

        const decoder = new TextDecoder();
        const reader = res.body.getReader();

        const pump: Pump = async ({ done, value }) => {
          if (done) {
            sub.complete();
            return;
          }

          const chunks: (AssistantTimelineEvent | SystemTimelineEvent)[] =
            decoder
              .decode(value)
              .split("\n")
              .filter(Boolean)
              .map((c) => JSON.parse(c));

          chunks.forEach((c) => sub.next(c));
          reader.read().then(pump);
        };

        reader.read().then(pump);
      });
    });

  const onKeyDown: Context["onKeyDown"] = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      dispatch({ type: "ENTER_KEY_DOWN" });
    }
  };

  const onKeyUp: Context["onKeyUp"] = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      dispatch({ type: "ENTER_KEY_UP" });
      process();
    }
  };

  const onMicClick: Context["onMicClick"] = () => {
    if (session.state === "LISTENING") {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening();
    }
  };

  const onChange: Context["onChange"] = (e) => {
    const { value } = e.currentTarget;
    dispatch({ type: "KEYBOARD_INPUT_RECEIVED", value });
    debouncedSetInactive();
  };

  const onEventRendered: Context["onEventRendered"] = (e) => {
    console.log(e);
  };

  const process = () => {
    debouncedSetInactive.cancel();

    if (session.value.length === 0) {
      dispatch({ type: "EMPTY_SUBMISSION" });
      throw new Error();
    }

    dispatch({ type: "START_ASSISTANT_REQUEST" });
    $timeline.set((prev) => [
      ...prev,
      {
        role: "USER",
        id: uuid.generate(),
        date: Date.now(),
        event: {
          type: "LANGUAGE_BASED",
          message: session.value
        }
      }
    ]);

    const req = request();

    let analysis: Analysis;
    let responsePromise: Promise<void> = Promise.resolve();

    req.subscribe({
      next: (c) => {
        $timeline.set((prev) => [...prev, c]);
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

        if (e.type === "PATCH") {
          const { patch: p } = e;
          if (p.type === "ARRAY") {
            patch({ [p.key]: p.value });
          } else {
            patch(p.data);
          }
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
    onKeyDown,
    onKeyUp,
    onMicClick,
    onChange,
    onEventRendered,

    sessions: state.sessions,
    enterDown: state.enterDown,
    state: state.state,
    spaceDown: state.spaceDown,
    timeline: $timeline.get(),
    uiState: state.uiState,
    lang: "en",

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
