"use client";

import "regenerator-runtime";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { AiSearch } from "@rems/ui";
import useRealEstateQuery, {
  removeDefaults
} from "@/hooks/use-real-estate-query";
import { RealEstateQuery } from "@rems/types";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { useDebouncedCallback } from "use-debounce";
import aiSearchViewContainerReducer from "reducers/ai-search-view-container-reducer";
import uuid from "short-uuid";

type ViewProps = React.ComponentProps<typeof AiSearch>;
type OnKeyDown = NonNullable<ViewProps["onKeyDown"]>;
type OnKeyUp = NonNullable<ViewProps["onKeyUp"]>;
type OnChange = NonNullable<ViewProps["onChange"]>;
type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

const fetcher = async (query: Partial<RealEstateQuery>, nl: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_REMS_API_URL}/assistant`, {
    method: "POST",
    body: JSON.stringify({ query, nl })
  });

  return new Promise<void>(async (resolve, reject) => {
    if (!res.body) {
      reject();
      return;
    }

    const decoder = new TextDecoder();
    const reader = res.body.getReader();

    const pump: Pump = async ({ done, value }) => {
      if (done) {
        resolve();
        return;
      }

      const chunks = decoder
        .decode(value)
        .split("\n")
        .filter(Boolean)
        .map((c) => JSON.parse(c));

      chunks.forEach(console.log);

      pump(await reader.read());
    };

    pump(await reader.read());
  });
};

const AiSearchViewContainer = () => {
  const [c, dispatch] = useReducer(aiSearchViewContainerReducer, {
    sessions: [{ id: uuid.generate(), value: "" }],
    state: "inactive",
    enterDown: false
  });

  const s = c.sessions[c.sessions.length - 1];

  const { transcript, listening } = useSpeechRecognition();
  const { commit, query } = useRealEstateQuery();
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
    const res = await fetcher(removeDefaults(query), s.value);
    dispatch({ type: "SUCCESSFUL_ASSISTANT_REQUEST" });

    setTimeout(() => {
      dispatch({ type: "SESSION_COMPLETE" });
    }, 1200);

    // console.log(res);
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
