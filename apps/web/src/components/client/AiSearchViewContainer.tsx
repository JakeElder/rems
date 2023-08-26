"use client";

import "regenerator-runtime";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { AiSearch } from "@rems/ui";
import useRealEstateQuery, {
  removeDefaults
} from "@/hooks/use-real-estate-query";
import { Chunk, RealEstateQuery } from "@rems/types";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { useDebouncedCallback } from "use-debounce";
import aiSearchViewContainerReducer from "reducers/ai-search-view-container-reducer";
import uuid from "short-uuid";
import { Observable } from "rxjs";

type ViewProps = React.ComponentProps<typeof AiSearch>;
type OnKeyDown = NonNullable<ViewProps["onKeyDown"]>;
type OnKeyUp = NonNullable<ViewProps["onKeyUp"]>;
type OnChange = NonNullable<ViewProps["onChange"]>;
type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

const fetcher = (query: Partial<RealEstateQuery>, nl: string) =>
  new Observable<Chunk>((s) => {
    const start = Date.now();

    fetch(`${process.env.NEXT_PUBLIC_REMS_API_URL}/assistant`, {
      method: "POST",
      body: JSON.stringify({ query, nl })
    }).then((res) => {
      if (!res.ok || !res.body) {
        s.error();
        return;
      }

      const decoder = new TextDecoder();
      const reader = res.body.getReader();

      const pump: Pump = async ({ done, value }) => {
        if (done) {
          s.complete();
          return;
        }

        const chunks: Chunk[] = decoder
          .decode(value)
          .split("\n")
          .filter(Boolean)
          .map((c) => JSON.parse(c));

        chunks.forEach((c) => {
          // console.log(Date.now() - start);
          s.next(c);
        });

        reader.read().then(pump);
      };

      reader.read().then(pump);
    });
  });

const AiSearchViewContainer = () => {
  const [c, dispatch] = useReducer(aiSearchViewContainerReducer, {
    sessions: [{ id: uuid.generate(), value: "" }],
    state: "inactive",
    enterDown: false
  });

  const s = c.sessions[c.sessions.length - 1];

  const { transcript, listening } = useSpeechRecognition();
  const { patch, query, reset } = useRealEstateQuery();
  const $input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!listening) {
      execute();
    }
  }, [listening]);

  useEffect(() => {
    if (listening) {
      dispatch({ type: "VOICE_INPUT_RECEIVED", value: transcript });
      const $i = $input.current!;
      Promise.resolve().then(() => {
        $i.scrollLeft = $i.scrollWidth;
      });
    }
  }, [listening, transcript]);

  const execute = async () => {
    debouncedSetInactive.cancel();

    if (s.value.length === 0) {
      dispatch({ type: "EMPTY_SUBMISSION" });
      return;
    }

    dispatch({ type: "START_ASSISTANT_REQUEST" });

    fetcher(removeDefaults(query), s.value).subscribe({
      next: (c) => {
        if (c.type === "STRATEGY" && (c.value === "NQ" || c.value === "CQ")) {
          reset();
        }
        if (c.type === "PATCH") {
          patch(c.data);
        }
      },
      complete() {
        dispatch({ type: "SUCCESSFUL_ASSISTANT_REQUEST" });
        setTimeout(() => {
          dispatch({ type: "SESSION_COMPLETE" });
        }, 1200);
      }
    });
  };

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch({ type: "INPUT_IDLE" }),
    500
  );

  const onMicClick = useCallback(() => {
    if (c.state === "listening") {
      SpeechRecognition.stopListening();
      dispatch({ type: "LISTENING_ABORTED" });
    } else {
      SpeechRecognition.startListening();
      dispatch({ type: "LISTENING_STARTED" });
    }
  }, [c.state]);

  const onKeyDown: OnKeyDown = useCallback((e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      dispatch({ type: "ENTER_KEY_DOWN" });
    }
  }, []);

  const onKeyUp: OnKeyUp = useCallback(
    (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        dispatch({ type: "ENTER_KEY_UP" });
        execute();
      }
    },
    [execute]
  );

  const onChange: OnChange = useCallback((e) => {
    const { value } = e.currentTarget;
    dispatch({ type: "KEYBOARD_INPUT_RECEIVED", value });
    debouncedSetInactive();
  }, []);

  const submittable =
    !!s.value && (c.state === "inputting" || c.state === "inactive");

  return (
    <AiSearch
      submittable={submittable}
      ref={$input}
      onMicClick={onMicClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      enterDown={c.enterDown}
      state={c.state}
      sessions={c.sessions}
      onChange={onChange}
    />
  );
};

export default AiSearchViewContainer;
