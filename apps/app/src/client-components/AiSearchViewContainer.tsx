"use client";

import "regenerator-runtime";
import React, { useEffect, useRef, useState } from "react";
import { AiSearch } from "@rems/ui";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { AiSearchInputState } from "@rems/types";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { resolveNl } from "../api.client";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";

type Props = {};

const AiSearchViewContainer = ({}: Props) => {
  const [value, setValue] = useState("");
  const { commit, query } = useRealEstateQuery();
  const [state, setState] = useState<AiSearchInputState>("inactive");
  const [activeSearch, setActiveSearch] = useState<null | string>(null);
  const $input = useRef<HTMLInputElement>(null);

  const { transcript } = useSpeechRecognition({
    clearTranscriptOnListen: true
  });

  useSWR(
    activeSearch ? [activeSearch, "nl"] : null,
    ([nl]) => resolveNl(query, nl),
    {
      onSuccess: (query) => {
        commit(query);
        setState("resolved");
        setTimeout(() => setState("inactive"), 2000);
      }
    }
  );

  useEffect(() => {
    if (state === "listening") {
      onInputReceived(transcript, true);
    }
  }, [transcript]);

  const onInputReceived = (value: string, fromSpeech: boolean = false) => {
    setValue(value);

    if (fromSpeech) {
      const $el = $input.current!;
      setTimeout(() => ($el.scrollLeft = 10000), 100);
    } else {
      setState("inputting");
    }

    debouncedExecute();
  };

  const execute = () => {
    SpeechRecognition.stopListening();
    if (value.length === 0) {
      setState("inactive");
    } else {
      setState("resolving");
      setActiveSearch(value);
    }
  };

  const debouncedExecute = useDebouncedCallback(execute, 2500);

  const onMicClick = () => {
    SpeechRecognition.startListening({ continuous: true });
    setState("listening");
    debouncedExecute();
  };

  return (
    <AiSearch
      ref={$input}
      onMicClick={onMicClick}
      onSubmit={(e) => {
        e.preventDefault();
        debouncedExecute.cancel();
        execute();
      }}
      history={[]}
      state={state}
      value={value}
      onChange={(e) => {
        onInputReceived(e.currentTarget.value);
      }}
    />
  );
};

export default AiSearchViewContainer;
