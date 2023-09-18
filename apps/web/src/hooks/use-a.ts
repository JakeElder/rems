import {
  AiSearchInputState,
  AiSearchSession,
  AssistantMessage,
  Timeline
} from "@rems/types";
import { useEffect } from "react";
import uuid from "short-uuid";
import { useDebouncedCallback } from "use-debounce";
import useRealEstateQuery from "./use-real-estate-query";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { Observable } from "rxjs";
import { observable } from "@legendapp/state";
import useKeyDown from "./use-key-down";
import { useSelector } from "@legendapp/state/react";

const NEXT_PUBLIC_REMS_API_URL = process.env.NEXT_PUBLIC_REMS_API_URL;

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;
type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

type Return = {
  // Fns
  onKeyDown: FormAttributes["onKeyDown"];
  onKeyUp: FormAttributes["onKeyUp"];
  onMicClick: () => void;
  onChange: InputHTMLAttributes["onChange"];
  process: () => Observable<AssistantMessage>;

  // State
  sessions: AiSearchSession[];
  state: AiSearchInputState;
  enterDown: boolean;
  spaceDown: boolean;
  timeline: Timeline;

  // Computed
  session: AiSearchSession;
  submittable: boolean;
};

const $state = observable<AiSearchInputState>("inactive");
const $enterDown = observable<boolean>(false);
const $spaceDown = observable<boolean>(false);
const $timeline = observable<Timeline>([]);
const $sessions = observable<AiSearchSession[]>([
  { id: uuid.generate(), value: "" }
]);

const decoder = new TextDecoder();

const useAssistant = (): Return => {
  const { transcript, listening } = useSpeechRecognition();
  const { query, reset, patch, commit } = useRealEstateQuery();

  $state.use();
  $enterDown.use();
  $spaceDown.use();
  $timeline.use();
  $sessions.use();

  const session = useSelector(
    () => $sessions.get()[$sessions.get().length - 1]
  );

  const submittable = useSelector(
    () =>
      session.value !== "" &&
      $state.get() !== "inputting" &&
      $state.get() !== "inactive"
  );

  const debouncedSetInactive = useDebouncedCallback(
    () => $state.set("inactive"),
    500
  );

  useEffect(() => {
    if (listening) {
      $state.set("listening");
      return;
    }

    if (session.value) {
      process();
    } else {
      $state.set("inactive");
    }
  }, [listening]);

  useEffect(() => {
    if (listening) {
      $sessions.set((prev) => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], value: transcript }
      ]);
    }
  }, [listening, transcript]);

  useKeyDown({
    code: "Space",
    down: () => {
      $spaceDown.set(true);
      // SpeechRecognition.startListening();
    },
    up: () => {
      console.log("up");
      $spaceDown.set(false);
      // SpeechRecognition.stopListening();
    }
  });

  const request = () => {
    return new Observable<AssistantMessage>((sub) => {
      fetch(`${NEXT_PUBLIC_REMS_API_URL}/assistant`, {
        method: "POST",
        body: JSON.stringify({ query, nl: session.value })
      }).then((res) => {
        if (!res.ok || !res.body) {
          sub.error();
          return;
        }

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
  };

  const onKeyDown: Return["onKeyDown"] = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      $enterDown.set(true);
    }
  };

  const onKeyUp: Return["onKeyUp"] = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      $enterDown.set(false);
      if (session.value) {
        process();
      }
    }
  };

  const onMicClick: Return["onMicClick"] = () => {
    if ($state.get() === "listening") {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening();
    }
  };

  const process: Return["process"] = () => {
    debouncedSetInactive.cancel();

    if (session.value.length === 0) {
      $state.set("inactive");
      throw new Error();
    }

    $enterDown.set(false);
    $state.set("resolving");
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

    req.subscribe({
      next: (message) => {
        $timeline.set((prev) => [
          ...prev,
          {
            type: "ASSISTANT",
            message,
            date: Date.now(),
            id: uuid.generate()
          }
        ]);

        if (
          message.type === "ANALYSIS" &&
          message.capability === "CLEAR_QUERY"
        ) {
          reset();
        }

        if (message.type === "REACTION" && message.reaction.type === "PATCH") {
          const { patch: p } = message.reaction;
          if (p.type === "ARRAY") {
            patch({ [p.key]: p.value });
          } else {
            patch(p.data);
          }
        }
      },

      complete() {
        commit();
        $state.set("resolved");
        setTimeout(() => $state.set("inactive"), 1200);
      }
    });

    return req;
  };

  const onChange: Return["onChange"] = (e) => {
    const { value } = e.currentTarget;
    $state.set("inputting");
    $sessions.set((prev) => [
      ...prev.slice(0, -1),
      { ...prev[prev.length - 1], value }
    ]);
    debouncedSetInactive();
  };

  return {
    // Fns
    onKeyUp,
    onKeyDown,
    onMicClick,
    process,
    onChange,

    // Observable
    sessions: $sessions.get(),
    enterDown: $enterDown.get(),
    spaceDown: $spaceDown.get(),
    timeline: $timeline.get(),
    state: $state.get(),

    // Computed
    session,
    submittable
  };
};

export default useAssistant;
