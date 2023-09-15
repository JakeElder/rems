import {
  AiSearchInputState,
  AiSearchSession,
  AssistantMessage,
  Timeline
} from "@rems/types";
import { useEffect } from "react";
import assistantReducer, {
  AssistantAction,
  AssistantState
} from "reducers/assistant-reducer";
import uuid from "short-uuid";
import { useDebouncedCallback } from "use-debounce";
import useRealEstateQuery from "./use-real-estate-query";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { Observable } from "rxjs";
import { observable, Observable as LegendObservable } from "@legendapp/state";

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;
type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

type UseAssistantReturn = {
  onKeyDown: FormAttributes["onKeyDown"];
  onKeyUp: FormAttributes["onKeyUp"];
  onMicClick: () => void;
  onChange: InputHTMLAttributes["onChange"];
  process: () => Observable<AssistantMessage>;
  sessions: AiSearchSession[];
  session: AiSearchSession;
  submittable: boolean;
  state: AiSearchInputState;
  enterDown: boolean;
  spaceDown: boolean;
  timeline: Timeline;
};

const $state: LegendObservable<AssistantState> = observable({
  sessions: [{ id: uuid.generate(), value: "" }],
  state: "inactive",
  enterDown: false,
  timeline: [],
  spaceDown: false
});

const isHTMLElement = (el: any): el is HTMLElement => el instanceof HTMLElement;

const dispatch = (action: AssistantAction) =>
  $state.set(assistantReducer($state.get(), action));

const useAssistant = () => {
  $state.use();

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch({ type: "INPUT_IDLE" }),
    500
  );

  const { transcript, listening } = useSpeechRecognition();
  const { query, reset, patch, commit } = useRealEstateQuery();

  const session = $state.sessions.get()[$state.sessions.get().length - 1];

  useEffect(() => {
    if (!listening && session.value) {
      ret.process();
    }
  }, [listening]);

  useEffect(() => {
    if (listening) {
      dispatch({ type: "VOICE_INPUT_RECEIVED", value: transcript });
    }
  }, [listening, transcript]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        dispatch({ type: "SPACE_KEY_DOWN" });
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        dispatch({ type: "SPACE_KEY_UP" });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

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
        if (session.value) {
          ret.process();
        }
      }
    },

    onMicClick: () => {
      if ($state.state.get() === "listening") {
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

      dispatch({
        type: "START_ASSISTANT_REQUEST",
        nl: session.value
      });

      const req = request();

      req.subscribe({
        next: (c) => {
          dispatch({ type: "ASSISTANT_MESSAGE_RECEIVED", value: c });

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

    onChange: (e) => {
      const { value } = e.currentTarget;
      dispatch({ type: "KEYBOARD_INPUT_RECEIVED", value });
      debouncedSetInactive();
    },

    session,
    sessions: $state.sessions.get(),
    enterDown: $state.enterDown.get(),
    spaceDown: $state.spaceDown.get(),
    timeline: $state.timeline.get(),

    submittable:
      !!session.value &&
      ($state.state.get() === "inputting" || $state.state.get() === "inactive"),

    state: $state.state.get()
  };

  return ret;
};

export default useAssistant;
