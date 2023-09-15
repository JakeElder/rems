import { AiSearchSession, AssistantMessage } from "@rems/types";
import { useEffect, useReducer } from "react";
import assistantReducer from "reducers/assistant-reducer";
import { Observable } from "rxjs";
import uuid from "short-uuid";
import { useDebouncedCallback } from "use-debounce";
import useRealEstateQuery from "./use-real-estate-query";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

type UseAssistantReturn = {
  onKeyDown: FormAttributes["onKeyDown"];
  onKeyUp: FormAttributes["onKeyUp"];
  onMicClick: () => void;
  process: () => Observable<AssistantMessage>;
  session: AiSearchSession;
  submittable: boolean;
};

const useAssistant = () => {
  const [state, dispatch] = useReducer(assistantReducer, {
    sessions: [{ id: uuid.generate(), value: "" }],
    state: "inactive",
    enterDown: false
  });

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch({ type: "INPUT_IDLE" }),
    500
  );

  const { transcript, listening } = useSpeechRecognition();
  const { query, reset, patch, commit } = useRealEstateQuery();

  useEffect(() => {
    if (!listening) {
      ret.process();
    }
  }, [listening]);

  useEffect(() => {
    if (listening) {
      dispatch({ type: "VOICE_INPUT_RECEIVED", value: transcript });
    }
  }, [listening, transcript]);

  const session = state.sessions[state.sessions.length - 1];

  const request = () =>
    new Observable<AssistantMessage>((sub) => {
      fetch(`${process.env.NEXT_PUBLIC_REMS_API_URL}/assistant`, {
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

  const ret: UseAssistantReturn = {
    onKeyDown: (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        dispatch({ type: "ENTER_KEY_DOWN" });
      }
    },

    onKeyUp: (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        dispatch({ type: "ENTER_KEY_UP" });
        ret.process();
      }
    },

    onMicClick: () => {
      if (state.state === "listening") {
        SpeechRecognition.stopListening();
        dispatch({ type: "LISTENING_ABORTED" });
      } else {
        SpeechRecognition.startListening();
        dispatch({ type: "LISTENING_STARTED" });
      }
    },

    process: () => {
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
    },

    session,

    submittable:
      !!session.value &&
      (state.state === "inputting" || state.state === "inactive")
  };

  return ret;
};

export default useAssistant;
