import useRealEstateQuery from "@/hooks/use-real-estate-query";
import {
  AiSearchInputState,
  AiSearchSession,
  AssistantMessage,
  Timeline
} from "@rems/types";
import { createContext, useContext, useEffect, useReducer } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import assistantReducer from "reducers/assistant-reducer";
import { Observable } from "rxjs";
import uuid from "short-uuid";
import { useDebouncedCallback } from "use-debounce";

const NEXT_PUBLIC_REMS_API_URL = process.env.NEXT_PUBLIC_REMS_API_URL;

type Props = {
  children: React.ReactNode;
};

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;
type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

type Context = {
  onKeyDown: FormAttributes["onKeyDown"];
  onKeyUp: FormAttributes["onKeyUp"];
  onMicClick: () => void;
  onChange: InputHTMLAttributes["onChange"];

  // State
  sessions: AiSearchSession[];
  state: AiSearchInputState;
  enterDown: boolean;
  // spaceDown: boolean;
  // timeline: Timeline;

  // Computed
  session: AiSearchSession;
  submittable: boolean;
};

const AssistantContext = createContext<Context | null>(null);
export const useAssistant = () => useContext(AssistantContext)!;

const AssistantProvider = ({ children }: Props) => {
  const { transcript, listening } = useSpeechRecognition();
  const { query, reset, patch, commit } = useRealEstateQuery();

  const [state, dispatch] = useReducer(assistantReducer, {
    sessions: [{ id: uuid.generate(), value: "" }],
    state: "inactive",
    enterDown: false
  });

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch({ type: "INPUT_IDLE" }),
    500
  );

  const session = state.sessions[state.sessions.length - 1];

  useEffect(() => {
    if (!listening && session.value) {
      process();
    }
  }, [listening]);

  useEffect(() => {
    if (listening) {
      dispatch({ type: "VOICE_INPUT_RECEIVED", value: transcript });
    }
  }, [listening, transcript]);

  const request = () =>
    new Observable<AssistantMessage>((sub) => {
      fetch(`${NEXT_PUBLIC_REMS_API_URL}/assistant`, {
        method: "POST",
        body: JSON.stringify({ query, nl: session.value })
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
    if (state.state === "listening") {
      SpeechRecognition.stopListening();
      dispatch({ type: "LISTENING_ABORTED" });
    } else {
      SpeechRecognition.startListening();
      dispatch({ type: "LISTENING_STARTED" });
    }
  };

  const onChange: Context["onChange"] = (e) => {
    const { value } = e.currentTarget;
    dispatch({ type: "KEYBOARD_INPUT_RECEIVED", value });
    debouncedSetInactive();
  };

  const process = () => {
    debouncedSetInactive.cancel();

    if (session.value.length === 0) {
      dispatch({ type: "EMPTY_SUBMISSION" });
      throw new Error();
    }

    dispatch({ type: "START_ASSISTANT_REQUEST" });
    const req = request();

    req.subscribe({
      next: (c) => {
        if (c.type === "ANALYSIS" && c.capability === "CLEAR_QUERY") {
          reset();
        }

        if (c.type === "REACTION" && c.reaction.type === "PATCH") {
          const { patch: p } = c.reaction;
          if (p.type === "ARRAY") {
            patch({ [p.key]: p.value });
          } else {
            patch(p.data);
          }
        }
      },

      complete() {
        commit();
        dispatch({ type: "SUCCESSFUL_ASSISTANT_REQUEST" });
        setTimeout(() => {
          dispatch({ type: "SESSION_COMPLETE" });
        }, 1200);
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

        sessions: state.sessions,
        enterDown: state.enterDown,
        state: state.state,

        session,
        submittable:
          !!session.value &&
          (state.state === "inputting" || state.state === "inactive")
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export default AssistantProvider;
