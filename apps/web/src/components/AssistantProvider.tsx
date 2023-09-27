import useAssistantKeys from "@/hooks/use-assistant-keys";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { Sound } from "@/utils";
import { observable } from "@legendapp/state";
import {
  InputSession,
  AssistantMessage,
  AssistantState,
  Timeline,
  TimelineEvent,
  Interaction
} from "@rems/types";
import { createContext, useContext, useEffect, useReducer } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import assistantReducer from "reducers/assistant-reducer";
import { Observable } from "rxjs";
import uuid from "short-uuid";
import { useDebouncedCallback } from "use-debounce";
import timelineToChatContext from "utils/timeline-to-chat-context";

const NEXT_PUBLIC_REMS_API_URL = process.env.NEXT_PUBLIC_REMS_API_URL;

type Props = {
  children: React.ReactNode;
};

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;
type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

const $timeline = observable<Timeline>([]);

type Context = {
  onKeyDown: FormAttributes["onKeyDown"];
  onKeyUp: FormAttributes["onKeyUp"];
  onMicClick: () => void;
  onChange: InputHTMLAttributes["onChange"];
  onOpenClose: (open: boolean) => void;
  onEventRendered: (e: TimelineEvent) => void;

  // State
  sessions: InputSession[];
  state: AssistantState;
  enterDown: boolean;
  spaceDown: boolean;
  open: boolean;
  timeline: Timeline;

  // Computed
  session: InputSession;
  submittable: boolean;
};

const AssistantContext = createContext<Context | null>(null);
export const useAssistant = () => useContext(AssistantContext)!;

const AssistantProvider = ({ children }: Props) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const { reset, patch, commit, serverQuery } = useRealEstateQuery();

  $timeline.use();

  const [state, dispatch] = useReducer(assistantReducer, {
    sessions: [{ id: uuid.generate(), value: "", state: "INACTIVE" }],
    state: "SLEEPING",
    enterDown: false,
    spaceDown: false,
    open: false
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
      dispatch({ type: "OPEN_CLOSE", open: true });
    },
    minus: () => {
      dispatch({ type: "OPEN_CLOSE", open: false });
    },
    escape: () => {
      dispatch({ type: "OPEN_CLOSE", open: false });
    }
  });

  const request = () =>
    new Observable<AssistantMessage>((sub) => {
      fetch(`${NEXT_PUBLIC_REMS_API_URL}/assistant`, {
        method: "POST",
        body: JSON.stringify({
          chatContext: timelineToChatContext($timeline.get()),
          query: serverQuery,
          nl: session.value
        })
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

          const chunks: AssistantMessage[] = decoder
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

  const onOpenClose: Context["onOpenClose"] = (open) => {
    dispatch({ type: "OPEN_CLOSE", open });
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
        type: "USER",
        id: uuid.generate(),
        date: Date.now(),
        interaction: { type: "WRITTEN", input: session.value }
      }
    ]);
    const req = request();

    let summary: Interaction;
    let responsePromise: Promise<void> = Promise.resolve();

    req.subscribe({
      next: (c) => {
        $timeline.set((prev) => [
          ...prev,
          {
            type: "ASSISTANT",
            id: uuid.generate(),
            date: Date.now(),
            message: c
          }
        ]);

        if (c.type === "ANALYSIS") {
          dispatch({ type: "ANALYSIS_COMPLETE", capability: c.capability });

          if (c.capability === "CLEAR_QUERY") {
            reset(true);
          }

          if (c.capability === "NEW_QUERY") {
            reset(false);
          }
        }

        if (c.type === "REACTION" && c.reaction.type === "PATCH") {
          const { patch: p } = c.reaction;
          if (p.type === "ARRAY") {
            patch({ [p.key]: p.value });
          } else {
            patch(p.data);
          }
        }

        if (c.type === "SUMMARY") {
          summary = c.summary;
          if (
            summary.analysis.capability === "REFINE_QUERY" ||
            summary.analysis.capability === "NEW_QUERY"
          ) {
            commit();
          }
        }

        if (c.type === "REACTION" && c.reaction.type === "LANGUAGE_BASED") {
          responsePromise = state.open
            ? Sound.speak(c.reaction.message)
            : Promise.resolve();
        }

        if (c.type === "UPDATE" && c.phase === "COMPLETE") {
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

  return (
    <AssistantContext.Provider
      value={{
        onKeyDown,
        onKeyUp,
        onMicClick,
        onChange,
        onOpenClose,
        onEventRendered,

        sessions: state.sessions,
        enterDown: state.enterDown,
        state: state.state,
        spaceDown: state.spaceDown,
        open: state.open,
        timeline: $timeline.get(),

        session,
        submittable:
          !!session.value &&
          (session.state === "INPUTTING" || session.state === "INACTIVE")
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export default AssistantProvider;
